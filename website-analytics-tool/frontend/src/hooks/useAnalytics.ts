import { useQuery } from '@tanstack/react-query'
import client from '../api/client'
import type {
  PageView,
  TopPage,
  TrafficSource,
  BrowserStat,
  OSStat,
  CountryStat,
} from '../types/types'

const useAnalytics = (siteId: string | undefined) => {
  const { data: pageViews = [] } = useQuery<PageView[]>({
    queryKey: ['pageviews', siteId],
    queryFn: async () => {
      const res = await client.get<PageView[]>(`/analytics/${siteId}/pageviews`)
      return res.data
    },
    enabled: !!siteId,
  })

  const { data: topPages = [] } = useQuery<TopPage[]>({
    queryKey: ['toppages', siteId],
    queryFn: async () => {
      const res = await client.get<TopPage[]>(`/analytics/${siteId}/toppages`)
      return res.data
    },
    enabled: !!siteId,
  })

  const { data: sources = [] } = useQuery<TrafficSource[]>({
    queryKey: ['sources', siteId],
    queryFn: async () => {
      const res = await client.get<TrafficSource[]>(
        `/analytics/${siteId}/sources`,
      )
      return res.data
    },
    enabled: !!siteId,
  })

  const { data: browsers = [] } = useQuery<BrowserStat[]>({
    queryKey: ['browsers', siteId],
    queryFn: async () => {
      const res = await client.get<BrowserStat[]>(
        `/analytics/${siteId}/browsers`,
      )
      return res.data
    },
    enabled: !!siteId,
  })

  const { data: osStats = [] } = useQuery<OSStat[]>({
    queryKey: ['os', siteId],
    queryFn: async () => {
      const res = await client.get<OSStat[]>(`/analytics/${siteId}/os`)
      return res.data
    },
    enabled: !!siteId,
  })

  const { data: countries = [] } = useQuery<CountryStat[]>({
    queryKey: ['countries', siteId],
    queryFn: async () => {
      const res = await client.get<CountryStat[]>(
        `/analytics/${siteId}/countries`,
      )
      return res.data
    },
    enabled: !!siteId,
  })

  return { pageViews, topPages, sources, browsers, osStats, countries }
}

export default useAnalytics
