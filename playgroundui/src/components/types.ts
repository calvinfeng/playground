export enum Orientation {
    Portrait = 'portrait',
    Landscape = 'landscape'
}

export type VideoJSON = {
    year: number
    month: string
    day: number
    title: string
    orientation: Orientation
    youtube_video_id: string
}