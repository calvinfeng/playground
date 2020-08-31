import React from 'react'
import './Fretboard.scss'
import {
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core'
import { Note, NoteName, Accidental } from '../music_theory/note'

type Props = {}

const NumFrets = 15

enum Interval {
  Major = "Major",
  Minor = "Minor",
  Diminished = "Diminished",
  Unison = "Unison",
  Perfect = "Perfect"
}

const intervalSemitoneMapping: Map<Interval, number>[] = [
  new Map<Interval, number>([[Interval.Unison, 0]]),
  new Map<Interval, number>([[Interval.Minor, 1], [Interval.Major, 2]]),
  new Map<Interval, number>([[Interval.Minor, 3], [Interval.Major, 4]]),
  new Map<Interval, number>([[Interval.Perfect, 5]]),
  new Map<Interval, number>([[Interval.Diminished, 6], [Interval.Perfect, 7]]),
  new Map<Interval, number>([[Interval.Minor, 8], [Interval.Major, 9]]),
  new Map<Interval, number>([[Interval.Minor, 10], [Interval.Major, 11]]),
]

const openFretNotes: Note[] = [
  new Note(NoteName.E, Accidental.Natural),
  new Note(NoteName.B, Accidental.Natural),
  new Note(NoteName.G, Accidental.Natural),
  new Note(NoteName.D, Accidental.Natural),
  new Note(NoteName.A, Accidental.Natural),
  new Note(NoteName.E, Accidental.Natural)
]

// TODO: Refactor this later, but now use repetitions.
export default function Fretboard(props: Props) {
  const [root, setRoot] = React.useState<NoteName>(NoteName.C)
  const [rootAccidental, setRootAccidental] = React.useState<Accidental>(Accidental.Natural)
  const [degree2nd, setDegree2nd] = React.useState<number>(intervalSemitoneMapping[1].get(Interval.Major) as number)
  const [degree3rd, setDegree3rd] = React.useState<number>(intervalSemitoneMapping[2].get(Interval.Major) as number)
  const [degree4th, setDegree4th] = React.useState<number>(intervalSemitoneMapping[3].get(Interval.Perfect) as number)
  const [degree5th, setDegree5th] = React.useState<number>(intervalSemitoneMapping[4].get(Interval.Perfect) as number)
  const [degree6th, setDegree6th] = React.useState<number>(intervalSemitoneMapping[5].get(Interval.Major) as number)
  const [degree7th, setDegree7th] = React.useState<number>(intervalSemitoneMapping[6].get(Interval.Major) as number)

  // Those degree should accept null values.
  const rootNote: Note = new Note(root, rootAccidental)
  console.log(rootNote.step(degree2nd))
  console.log(rootNote.step(degree3rd))
  console.log(rootNote.step(degree4th))
  console.log(rootNote.step(degree5th))
  console.log(rootNote.step(degree6th))
  console.log(rootNote.step(degree7th))
  
  const rows: JSX.Element[] = []
  for (let j = 0; j <= 5; j++) {
    const row: JSX.Element[] = [
      <Grid item>
        <Button variant="contained" color="default" style={{height: 35, width: 70, margin: 1}}>
          {`${openFretNotes[j]}`}
        </Button>
      </Grid>
    ]

    for (let i = 1; i <= NumFrets; i++) {
      const notes = openFretNotes[j].step(i)
      row.push(
        <Grid item>
          <Button variant="contained" color="default" style={{height: 35, width: 70, margin: 1}}>
            {notes.map((note) => `${note}`).join(',')}
          </Button>
        </Grid>
      )
    }

    rows.push(
      <Grid
        direction="row"
        justify="flex-start"
        alignItems="baseline"
        container
        spacing={0}>
        {row}
      </Grid>
    )
  }

  const handleSelectRootNote = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRoot(event.target.value as NoteName)
  }

  const handleSelectRootNoteAccidental = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRootAccidental(event.target.value as Accidental)
  }

  const selectRootForm: JSX.Element = (
    <FormControl className="form-control">
      <InputLabel id="root-select-label">Root</InputLabel>
      <Select
        labelId="root-select-label"
        id="root-select"
        value={root}
        onChange={handleSelectRootNote}>
        {
          Object.keys(NoteName).map((noteName: string): JSX.Element => (
            <MenuItem value={noteName}>{noteName}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )

  const selectAccidentalForm: JSX.Element = (
    <FormControl>
      <InputLabel id="root-accidental-select-label">Accidental</InputLabel>
      <Select
        labelId="root-accidental-select-label"
        id="accidental-select"
        value={rootAccidental}
        onChange={handleSelectRootNoteAccidental}>
        {
          Object.keys(Accidental).map((key: string): JSX.Element => (
            <MenuItem value={key}>{key}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )

  const select2ndDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-2-select-label">2nd</InputLabel>
      <Select
        labelId="degree-2-select-label"
        id="degree-2-select"
        value={"Major"}
        onChange={() => {}}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
      </Select>
    </FormControl>
  )

  const select3rdDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-3-select-label">3rd</InputLabel>
      <Select
        labelId="degree-3-select-label"
        id="degree-3-select"
        value={"Major"}
        onChange={() => {}}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
      </Select>
    </FormControl>
  )

  const select4thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-4-select-label">4th</InputLabel>
      <Select
        labelId="degree-4-select-label"
        id="degree-4-select"
        value={"Perfect"}
        onChange={() => {}}>
        <MenuItem value="Perfect">Perfect</MenuItem>
      </Select>
    </FormControl>
  )

  const select5thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-5-select-label">5th</InputLabel>
      <Select
        labelId="degree-5-select-label"
        id="degree-5-select"
        value={"Perfect"}
        onChange={() => {}}>
        <MenuItem value="Perfect">Perfect</MenuItem>
        <MenuItem value="Diminished">Diminished</MenuItem>
      </Select>
    </FormControl>
  )

  const select6thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-6-select-label">6th</InputLabel>
      <Select
        labelId="degree-6-select-label"
        id="degree-6-select"
        value={"Major"}
        onChange={() => {}}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
      </Select>
    </FormControl>
  )

  const select7thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-7-select-label">7th</InputLabel>
      <Select
        labelId="degree-7-select-label"
        id="degree-7-select"
        value={"Major"}
        onChange={() => {}}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
      </Select>
    </FormControl>
  )

  return (
    <section className="Fretboard">
      <section className="fretboard">
        <Grid
          className="fretboard-grid"
          direction="row"
          justify="flex-start"
          alignItems="baseline"
          container
          spacing={0}>
          {rows}
        </Grid>
      </section>
      <section className="scale-selector">
        <Grid
          className="scale-selector-grid"
          direction="row"
          justify="flex-start"
          alignItems="center"
          container
          spacing={1}>
          <Grid item>{selectRootForm}</Grid>
          <Grid item>{selectAccidentalForm}</Grid>
          <Grid item>{select2ndDegreeForm}</Grid>
          <Grid item>{select3rdDegreeForm}</Grid>
          <Grid item>{select4thDegreeForm}</Grid>
          <Grid item>{select5thDegreeForm}</Grid>
          <Grid item>{select6thDegreeForm}</Grid>
          <Grid item>{select7thDegreeForm}</Grid>
        </Grid>
      </section>
    </section>
  )
}