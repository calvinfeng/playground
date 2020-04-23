export enum Orientation {
    Portrait = 'portrait',
    Landscape = 'landscape'
}

export type VideoJSON = {
    year: number
    month: string
    day: number
    youtube_url: string
    title: string
    description: string
    orientation: Orientation
}