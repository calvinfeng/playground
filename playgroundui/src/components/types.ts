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
  children: string[]
  name: string
} 

export type LogEntryJSON = {
  id: string
  date: Date
  user_id: string
  message: string
  details: string
  duration: number
  labels: LogLabelJSON[]
  assignments: LogAssignmentJSON[]
}

export type LogAssignmentJSON = {
  position: number
  name: string
  completed: boolean
}

export type GoogleUserProfile = {
  token_id: string
  access_token: string
  granted_scopes: string
  google_user_id: string;
  google_email: string;
  full_name: string;
  given_name: string;
  family_name: string;
  image_url: string;
}