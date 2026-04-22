'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Exercise = {
  _id: string
  name: string
}

type ExerciseEntry = {
  exercise: string
  sets: number
  reps: number
  weight: number
  notes?: string
}

type PlanForm = {
  name: string
  date: string
  comments: string
  exercises: ExerciseEntry[]
}

export default function EditWorkoutPlanPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [form, setForm] = useState<PlanForm>({
    name: '',
    date: '',
    comments: '',
    exercises: [],
  })
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [planRes, exercisesRes] = await Promise.all([
          fetch(`/api/workout-plan/${id}`),
          fetch('/api/exercise'),
        ])

        if (!planRes.ok) throw new Error('Failed to load workout plan')
        if (!exercisesRes.ok) throw new Error('Failed to load exercises')

        const planData = await planRes.json()
        const exercisesData = await exercisesRes.json()

        setForm({
          name: planData.name,
          comments: planData.comments || '',
          date: planData.date
            ? new Date(planData.date).toISOString().split('T')[0]
            : '',
          exercises:
            planData.exercises?.map((e: any) => ({
              exercise: e.exercise._id ?? e.exercise,
              sets: e.sets,
              reps: e.reps,
              weight: e.weight || 0,
              notes: e.notes || '',
            })) ?? [],
        })

        setAllExercises(exercisesData)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load workout plan'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const updateForm = (
    field: keyof Omit<PlanForm, 'exercises'>,
    value: string,
  ) => setForm((prev) => ({ ...prev, [field]: value }))

  const updateEntry = (
    index: number,
    field: keyof ExerciseEntry,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e, i) =>
        i === index ? { ...e, [field]: value } : e,
      ),
    }))
  }

  const addExercise = () =>
    setForm((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { exercise: '', sets: 3, reps: 10, weight: 0, notes: '' },
      ],
    }))

  const removeExercise = (index: number) =>
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))

  const handleSave = async () => {
    setError(null)
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        exercises: form.exercises.map((e) => ({
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          notes: e.notes?.trim() || undefined,
        })),
        comments: form.comments.trim() || undefined,
        date: form.date ? form.date : undefined,
      }

      const res = await fetch(`/api/workout-plan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to save workout plan')
      }

      router.push('/dashboard/workout-plans')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save workout plan'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
        <div className='mx-auto max-w-3xl px-4 md:px-6'>
          <p className='text-center text-muted-foreground'>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
      <div className='mx-auto max-w-3xl px-4 md:px-6 flex flex-col gap-6'>
        <h1 className='text-3xl font-bold tracking-tight'>Edit Workout Plan</h1>

        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='name'>Plan Name</Label>
            <Input
              id='name'
              placeholder='Enter plan name'
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              disabled={saving}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='date'>Date (Optional)</Label>
            <Input
              id='date'
              type='date'
              value={form.date}
              onChange={(e) => updateForm('date', e.target.value)}
              disabled={saving}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='comments'>Comments (Optional)</Label>
            <Input
              id='comments'
              placeholder='Add any comments'
              value={form.comments}
              onChange={(e) => updateForm('comments', e.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <Label>Exercises</Label>
          {form.exercises.map((entry, i) => (
            <Card key={i}>
              <CardContent className='flex flex-col gap-3 pt-4'>
                <div className='flex flex-col gap-1'>
                  <Label className='text-sm font-medium'>Exercise</Label>
                  <Select
                    value={entry.exercise}
                    onValueChange={(val) => updateEntry(i, 'exercise', val)}
                    disabled={saving}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select exercise' />
                    </SelectTrigger>
                    <SelectContent>
                      {allExercises.map((ex) => (
                        <SelectItem key={ex._id} value={ex._id}>
                          {ex.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col gap-1'>
                    <Label className='text-sm font-medium'>Sets</Label>
                    <Input
                      type='number'
                      min='1'
                      value={entry.sets}
                      onChange={(e) =>
                        updateEntry(i, 'sets', Number(e.target.value))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <Label className='text-sm font-medium'>Reps</Label>
                    <Input
                      type='number'
                      min='1'
                      value={entry.reps}
                      onChange={(e) =>
                        updateEntry(i, 'reps', Number(e.target.value))
                      }
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1'>
                  <Label className='text-sm font-medium'>Weight</Label>
                  <Input
                    type='number'
                    min='0'
                    step='0.5'
                    value={entry.weight}
                    onChange={(e) =>
                      updateEntry(i, 'weight', Number(e.target.value))
                    }
                    disabled={saving}
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <Label className='text-sm font-medium'>
                    Notes (Optional)
                  </Label>
                  <Input
                    type='text'
                    placeholder='Add notes'
                    value={entry.notes || ''}
                    onChange={(e) => updateEntry(i, 'notes', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => removeExercise(i)}
                  disabled={saving}
                >
                  Remove Exercise
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button
            variant='outline'
            onClick={addExercise}
            disabled={saving}
            className='w-full'
          >
            + Add Exercise
          </Button>
        </div>

        <div className='flex gap-2'>
          <Button
            onClick={handleSave}
            disabled={saving || form.exercises.length === 0}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant='ghost'
            onClick={() => router.push('/dashboard/workout-plans')}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
