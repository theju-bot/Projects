'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type ExerciseDetail = {
  _id: string
  name: string
  description?: string
  category?: string
}

type WorkoutExercise = {
  _id?: string
  exercise: ExerciseDetail
  sets: number
  reps: number
  weight: number
  notes?: string
}

type WorkoutPlanDetail = {
  _id: string
  name: string
  date: string
  comments?: string
  exercises: WorkoutExercise[]
  createdAt?: string
  updatedAt?: string
}

export default function ViewWorkoutPlanPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [plan, setPlan] = useState<WorkoutPlanDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/workout-plan/${id}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Workout plan not found')
          }
          throw new Error('Failed to load workout plan')
        }

        const data = await res.json()
        setPlan(data)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load workout plan'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPlan()
    }
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workout plan?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/workout-plan/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete workout plan')
      }

      router.push('/dashboard/workout-plans')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete workout plan'
      setError(message)
      setDeleting(false)
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

  if (error || !plan) {
    return (
      <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
        <div className='mx-auto max-w-3xl px-4 md:px-6 flex flex-col gap-6'>
          <Button
            variant='ghost'
            onClick={() => router.push('/dashboard/workout-plans')}
          >
            ← Back to Plans
          </Button>

          <Alert variant='destructive'>
            <AlertDescription>
              {error || 'Workout plan not found'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(plan.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalVolume = plan.exercises.reduce(
    (sum, ex) => sum + ex.sets * ex.reps * ex.weight,
    0,
  )

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
      <div className='mx-auto max-w-3xl px-4 md:px-6 flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            onClick={() => router.push('/dashboard/workout-plans')}
          >
            ← Back to Plans
          </Button>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => router.push(`/dashboard/workout-plans/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>{plan.name}</h1>
          <div className='flex flex-col gap-1 text-sm text-muted-foreground'>
            <p>📅 {formattedDate}</p>
            {plan.comments && <p>📝 {plan.comments}</p>}
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium'>Exercises</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{plan.exercises.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium'>Total Sets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>
                {plan.exercises.reduce((sum, ex) => sum + ex.sets, 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium'>
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{totalVolume.toFixed(0)} lbs</p>
            </CardContent>
          </Card>
        </div>

        <div className='flex flex-col gap-3'>
          <h2 className='text-xl font-semibold'>Exercises</h2>

          {plan.exercises.length === 0 ? (
            <Card>
              <CardContent className='pt-6 text-center text-muted-foreground'>
                No exercises in this plan
              </CardContent>
            </Card>
          ) : (
            <div className='flex flex-col gap-3'>
              {plan.exercises.map((exercise, index) => (
                <Card key={exercise._id || index}>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <CardTitle className='text-lg'>
                          {exercise.exercise.name}
                        </CardTitle>
                        {exercise.exercise.category && (
                          <CardDescription>
                            Category: {exercise.exercise.category}
                          </CardDescription>
                        )}
                      </div>
                      <div className='text-right text-sm font-medium text-muted-foreground'>
                        #{index + 1}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                      <div className='flex flex-col gap-1'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          SETS
                        </p>
                        <p className='text-lg font-semibold'>
                          {exercise.sets}
                        </p>
                      </div>

                      <div className='flex flex-col gap-1'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          REPS
                        </p>
                        <p className='text-lg font-semibold'>
                          {exercise.reps}
                        </p>
                      </div>

                      <div className='flex flex-col gap-1'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          WEIGHT
                        </p>
                        <p className='text-lg font-semibold'>
                          {exercise.weight} lbs
                        </p>
                      </div>

                      <div className='flex flex-col gap-1'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          VOLUME
                        </p>
                        <p className='text-lg font-semibold'>
                          {(exercise.sets * exercise.reps * exercise.weight).toFixed(0)}{' '}
                          lbs
                        </p>
                      </div>
                    </div>

                    {exercise.exercise.description && (
                      <div className='border-t pt-4'>
                        <p className='text-xs font-medium text-muted-foreground mb-1'>
                          DESCRIPTION
                        </p>
                        <p className='text-sm'>{exercise.exercise.description}</p>
                      </div>
                    )}

                    {exercise.notes && (
                      <div className='border-t pt-4'>
                        <p className='text-xs font-medium text-muted-foreground mb-1'>
                          NOTES
                        </p>
                        <p className='text-sm italic text-muted-foreground'>
                          {exercise.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {(plan.createdAt || plan.updatedAt) && (
          <Card className='bg-muted/50'>
            <CardContent className='pt-4 flex flex-col gap-1 text-xs text-muted-foreground'>
              {plan.createdAt && (
                <p>
                  Created:{' '}
                  {new Date(plan.createdAt).toLocaleDateString()} at{' '}
                  {new Date(plan.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
              {plan.updatedAt && (
                <p>
                  Last updated:{' '}
                  {new Date(plan.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(plan.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
