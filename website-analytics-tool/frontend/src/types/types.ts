export interface User {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Site {
  _id: string
  userId: string
  name: string
  domain: string
  createAt: string
  updateAt: string
}

export interface Event {
  _id: string
  siteId: string
  type: string
  path: string
  referrer: string
  browser: string
  os: string
  country: string
  createdAt: string
  updatedAt: string
}

export interface PageView {
  date: string
  count: number
}

export interface TopPage {
  path: string
  count: number
}

export interface TrafficSource {
  referrer: string
  count: number
}

export interface BrowserStat {
  browser: string
  count: number
}

export interface OSStat {
  os: string
  count: number
}

export interface CountryStat {
  country: string
  count: number
}
