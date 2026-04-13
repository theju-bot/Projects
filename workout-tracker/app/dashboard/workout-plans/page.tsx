// app/dashboard/workout-plans/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkoutPlansPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8">   {/* shadcn uses bg-background */}

      {/* Main centered container */}
      <div className="mx-auto max-w-3xl px-4 md:px-6">   {/* Better than hard 50% */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workout Plans</h1>
            <p className="text-muted-foreground">Manage and create your training programs</p>
          </div>
          <Button>+ New Plan</Button>
        </div>

        {/* Example content using shadcn Card */}
        <Card>
          <CardHeader>
            <CardTitle>No plans yet</CardTitle>
            <CardDescription>
              Create your first workout plan to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            Your plans will appear here.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}