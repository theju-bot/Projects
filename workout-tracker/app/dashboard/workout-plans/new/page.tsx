'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

export default function NewWorkoutPlanPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [comments, setComments] = useState('')
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExercises = async () => {``
      try {
        const res = await fetch('/api/exercise')
        if (!res.ok) throw new Error('Failed to fetch exercises')
        const data = await res.json()
        setAllExercises(data)
      } catch (err) {
        setError('Failed to load exercises')
      }
    }
    fetchExercises()
  }, [])

  const updateEntry = (
    index: number,
    field: keyof ExerciseEntry,
    value: string | number,
  ) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === index
          ? {
            ...e,
            [field]: typeof value === 'string' ? value : value,
          }
          : e,
      ),
    )
  }

  const addExercise = () =>
    setExercises((prev) => [
      ...prev,
      { exercise: '', sets: 3, reps: 10, weight: 0, notes: '' },
    ])

  const removeExercise = (index: number) =>
    setExercises((prev) => prev.filter((_, i) => i !== index))

  const handleCreate = async () => {
    setError(null)

    if (!name.trim()) {
      setError('Plan name is required')
      return
    }

    if (exercises.length === 0) {
      setError('At least one exercise is required')
      return
    }

    if (exercises.some((e) => !e.exercise)) {
      setError('Select an exercise for each entry')
      return
    }

    if (exercises.some((e) => e.sets < 1 || e.reps < 1)) {
      setError('Sets and reps must be at least 1')
      return
    }

    if (exercises.some((e) => e.weight < 0)) {
      setError('Weight must be a positive number')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        exercises: exercises.map((e) => ({
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          notes: e.notes?.trim() || undefined,
        })),
        comments: comments.trim() || undefined,
        date: date ? new Date(date).toISOString() : undefined,
      }

      const res = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create workout plan')
      }

      router.push('/dashboard/workout-plans')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create workout plan'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
      <div className='mx-auto max-w-3xl px-4 md:px-6 flex flex-col gap-6'>
        <h1 className='text-3xl font-bold tracking-tight'>New Workout Plan</h1>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='date'>Date (Optional)</Label>
            <Input
              id='date'
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='comments'>Comments (Optional)</Label>
            <Input
              id='comments'
              placeholder='Add any comments'
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={saving}
            />
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <Label>Exercises</Label>
          {exercises.map((entry, i) => (
            <Card key={i}>
              <CardContent className='flex flex-col gap-3 pt-4'>
                <div className='flex flex-col gap-1'>
                  <label className='text-sm font-medium'>Exercise</label>
                  <select
                    className='border rounded px-2 py-2 text-sm bg-background'
                    value={entry.exercise}
                    onChange={(e) => updateEntry(i, 'exercise', e.target.value)}
                    disabled={saving}
                  >
                    <option value=''>Select exercise</option>
                    {allExercises.map((ex) => (
                      <option key={ex._id} value={ex._id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>Sets</label>
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
                    <label className='text-sm font-medium'>Reps</label>
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
                  <label className='text-sm font-medium'>Weight</label>
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
                  <label className='text-sm font-medium'>Notes (Optional)</label>
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
            onClick={handleCreate}
            disabled={saving || exercises.length === 0}
          >
            {saving ? 'Creating...' : 'Create Plan'}
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
