'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

type WorkoutPlan = {
  _id: string
  name: string
  date: string
}

export default function WorkoutPlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch('/api/workout-plan')
      const data = await res.json()
      setPlans(data)
      setLoading(false)
    }
    fetchPlans()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    await fetch(`/api/workout-plan/${id}`, { method: 'DELETE' })
    setPlans((prev) => prev.filter((p) => p._id !== id))
  }

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-background py-8'>
      <div className='mx-auto max-w-3xl px-4 md:px-6'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Workout Plans</h1>
            <p className='text-muted-foreground'>
              Manage your training programs
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/workout-plans/new')}>
            + New Plan
          </Button>
        </div>

        {loading ? (
          <p className='text-muted-foreground text-center text-3xl py-12'>Loading...</p>
        ) : plans.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No plans yet</CardTitle>
              <CardDescription>
                Create your first workout plan to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className='text-center py-12 text-muted-foreground'>
              Your plans will appear here.
            </CardContent>
          </Card>
        ) : (
          <div className='flex flex-col gap-4'>
            {plans.map((plan) => (
              <Card key={plan._id}>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        {new Date(plan.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          router.push(
                            `/dashboard/workout-plans/${plan._id}/edit`,
                          )
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDelete(plan._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
