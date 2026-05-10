'use client'

import { useColumns } from '@/hooks/useColumns'
import { useJobs } from '@/hooks/useJobs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs()
  const { data: columns = [], isLoading: columnsLoading } = useColumns()

  if (jobsLoading || columnsLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-48' />
        <div className='grid grid-cols-2 gap-4'>
          <Skeleton className='h-64' />
          <Skeleton className='h-64' />
        </div>
      </div>
    )
  }

  const jobsByColumn = columns.map((col) => ({
    name: col.name,
    count: jobs.filter((j) => j.columnId === col._id).length,
    color: col.color,
    fill: col.color,
  }))

  const totalJobs = jobs.length

  const appliedColumn = columns.find((c) =>
    c.name.toLowerCase().includes('applied'),
  )
  const interviewColumn = columns.find((c) =>
    c.name.toLowerCase().includes('interview'),
  )
  const offerColumn = columns.find((c) =>
    c.name.toLowerCase().includes('offer'),
  )
  const rejectColumn = columns.find((c) =>
    c.name.toLowerCase().includes('reject'),
  )

  const appliedCount = appliedColumn
    ? jobs.filter((j) => j.columnId === appliedColumn._id).length
    : 0
  const interviewCount = interviewColumn
    ? jobs.filter((j) => j.columnId === interviewColumn._id).length
    : 0
  const offerCount = offerColumn
    ? jobs.filter((j) => j.columnId === offerColumn._id).length
    : 0
  const rejectedCount = rejectColumn
    ? jobs.filter((j) => j.columnId === rejectColumn._id).length
    : 0

  const responseRate =
    appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0

  const stats = [
    { label: 'Total Jobs', value: totalJobs },
    { label: 'Applied', value: appliedCount },
    { label: 'Interviews', value: interviewCount },
    { label: 'Offers', value: offerCount },
    { label: 'Rejected', value: rejectedCount },
    { label: 'Response Rate', value: `${responseRate}%` },
  ]

  const pieData = jobsByColumn.filter((c) => c.count > 0).map((c) => ({ ...c, fill: c.color }))

  const funnelData = [
    { stage: 'Total Tracked', count: totalJobs, fill: '#6366f1' },
    { stage: 'Applied', count: appliedCount, fill: '#6366f1' },
    { stage: 'Interview', count: interviewCount, fill: '#6366f1' },
    { stage: 'Offer', count: offerCount, fill: '#6366f1' },
  ]

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold'>Analytics</h1>

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className='p-4'>
              <p className='text-sm text-muted-foreground'>{stat.label}</p>
              <p className='text-3xl font-bold mt-1'>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {totalJobs === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No jobs tracked yet
              </p>
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <BarChart
                  data={jobsByColumn}
                  margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                >
                  <XAxis
                    dataKey='name'
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey='count' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {totalJobs === 0 ? (
              <p className='text-sm text-muted-foreground'>
                No jobs tracked yet
              </p>
            ) : (
              <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey='count'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: '12px' }}>{value}</span>
                    )}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          {totalJobs === 0 ? (
            <p className='text-sm text-muted-foreground'>No jobs tracked yet</p>
          ) : (
            <ResponsiveContainer width='100%' height={200}>
              <BarChart
                layout='vertical'
                data={funnelData}
                margin={{ top: 4, right: 20, left: 60, bottom: 4 }}
              >
                <XAxis
                  type='number'
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type='category'
                  dataKey='stage'
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar dataKey='count' radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
