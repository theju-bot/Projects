import { useParams } from 'react-router-dom'
import useAnalytics from '../hooks/useAnalytics'
import { useAppSelector } from '../store/hooks'
import { selectSelectedSite } from '../store/slices/sitesSlice'
import { useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#a855f7',
]

const Dashboard = () => {
  const { siteId } = useParams<{ siteId: string }>()
  const selectedSite = useAppSelector(selectSelectedSite)
  const { pageViews, topPages, sources, browsers, osStats, countries } =
    useAnalytics(siteId)

  useEffect(() => {
    document.title = 'Dashboard — Analytics'
  }, [])

  const browsersWithColor = browsers.map((b, i) => ({
    ...b,
    fill: COLORS[i % COLORS.length],
  }))

  const osWithColor = osStats.map((o, i) => ({
    ...o,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Analytics Dashboard</h1>
      <p className='text-muted-foreground text-sm mb-6'>
        {selectedSite?.name ?? 'Dashboard'}
        {selectedSite?.domain && <span> - {selectedSite?.domain}</span>}
      </p>
      <Tabs defaultValue='pageviews'>
        <TabsList className='mb-4'>
          <TabsTrigger value='pageviews'>Page Views</TabsTrigger>
          <TabsTrigger value='toppages'>Top Pages</TabsTrigger>
          <TabsTrigger value='sources'>Sources</TabsTrigger>
          <TabsTrigger value='browsers'>Browsers</TabsTrigger>
          <TabsTrigger value='os'>OS</TabsTrigger>
          <TabsTrigger value='countries'>Countries</TabsTrigger>
        </TabsList>

        <TabsContent value='pageviews'>
          <h2 className='text-lg font-semibold mb-4'>Page Views Over Time</h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={pageViews}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='count'
                stroke='#6366f1'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value='toppages'>
          <h2 className='text-lg font-semibold mb-4'>Top Pages</h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={topPages}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='path' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill='#6366f1' />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value='sources'>
          <h2 className='text-lg font-semibold mb-4'>Traffic Sources</h2>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={sources}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='referrer' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='count' fill='#22c55e' />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value='browsers'>
          <h2 className='text-lg font-semibold mb-4'>Browser Breakdown</h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={browsersWithColor}
                dataKey='count'
                nameKey='browser'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              />
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value='os'>
          <h2 className='text-lg font-semibold mb-4'>OS Breakdown</h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={osWithColor}
                dataKey='count'
                nameKey='os'
                cx='50%'
                cy='50%'
                outerRadius={100}
                label
              />
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value='countries'>
          <h2 className='text-lg font-semibold mb-4'>Countries</h2>
          <div className='border border-border rounded-md overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-muted'>
                <tr>
                  <th className='text-left p-3'>Country</th>
                  <th className='text-right p-3'>Visits</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((c) => (
                  <tr key={c.country} className='border-t border-border'>
                    <td className='p-3'>{c.country || 'Unknown'}</td>
                    <td className='p-3 text-right'>{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
