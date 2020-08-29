export enum Orientation {
  Portrait = 'portrait',
  Landscape = 'landscape'
}

export type VideoJSON = {
  year: number
  month: string
  day: number
  title: string
  description: string
  orientation: Orientation
  youtube_video_id: string
}

export type MonthlySummaryJSON = {
  year: number
  month: string
  title: string
  subtitle: string
  body: string
}

export type LogLabelJSON = {
  id: string
  parent_id: string | null
  children: LogLabelJSON[]
  name: string
} 

export type LogEntryJSON = {
  id: string
  date: Date
  labels: LogLabelJSON[]
  message: string
  duration: number
}