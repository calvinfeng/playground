export enum Interval {
  Major = "Major",
  Minor = "Minor",
  Diminished = "Diminished",
  Unison = "Unison",
  Perfect = "Perfect",
  Disabled = "Disabled"
}

export const IntervalSemitoneMapping: Map<Interval, number>[] = [
  new Map<Interval, number>([[Interval.Unison, 0]]),
  new Map<Interval, number>([[Interval.Minor, 1], [Interval.Major, 2]]), 
  new Map<Interval, number>([[Interval.Minor, 3], [Interval.Major, 4]]),
  new Map<Interval, number>([[Interval.Perfect, 5]]),
  new Map<Interval, number>([[Interval.Diminished, 6], [Interval.Perfect, 7]]),
  new Map<Interval, number>([[Interval.Minor, 8], [Interval.Major, 9]]),
  new Map<Interval, number>([[Interval.Minor, 10], [Interval.Major, 11]]),
]