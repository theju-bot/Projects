'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

type Exercise = {
  _id: string
  name: string
}

type ExerciseEntry = {
  exercise: string
  sets: number
  reps: number
}

export default function NewWorkoutPlanPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/exercise')
      .then(res => res.json())
      .then(setAllExercises)
  }, [])

  const updateEntry = (index: number, field: keyof ExerciseEntry, value: string | number) => {
    setExercises(prev =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    )
  }

  const addExercise = () =>
    setExercises(prev => [...prev, { exercise: '', sets: 3, reps: 10 }])

  const removeExercise = (index: number) =>
    setExercises(prev => prev.filter((_, i) => i !== index))

  const handleCreate = async () => {
    if (!name.trim()) return alert('Plan name is required.')
    if (exercises.some(e => !e.exercise)) return alert('Select an exercise for each entry.')

    setSaving(true)
    try {
      const res = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date: date || undefined, exercises }),
      })
      if (res.ok) router.push('/dashboard/workout-plans')
      else alert('Create failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8">
      <div className="mx-auto max-w-3xl px-4 md:px-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">New Workout Plan</h1>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Plan name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          {exercises.map((entry, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-2 pt-4">
                <select
                  className="border rounded px-2 py-1 text-sm bg-background"
                  value={entry.exercise}
                  onChange={e => updateEntry(i, 'exercise', e.target.value)}
                >
                  <option value="">Select exercise</option>
                  {allExercises.map(ex => (
                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Sets"
                    value={entry.sets}
                    onChange={e => updateEntry(i, 'sets', Number(e.target.value))}
                  />
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={entry.reps}
                    onChange={e => updateEntry(i, 'reps', Number(e.target.value))}
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeExercise(i)}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={addExercise}>+ Add Exercise</Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={saving}>
            {saving ? 'Creating...' : 'Create Plan'}
          </Button>
          <Button variant="ghost" onClick={() => router.push('/dashboard/workout-plans')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}