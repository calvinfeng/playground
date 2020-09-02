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
import { Interval, IntervalSemitoneMapping } from '../music_theory/scale'
import { Note, NoteName, Accidental } from '../music_theory/note'

const NumFrets = 15

const allowedAccidentalsByNote = new Map<NoteName, Accidental[]>([
  [NoteName.C, [Accidental.Natural, Accidental.Sharp]],
  [NoteName.D, [Accidental.Flat, Accidental.Natural, Accidental.Sharp]],
  [NoteName.E, [Accidental.Flat, Accidental.Natural]],
  [NoteName.F, [Accidental.Natural, Accidental.Sharp]],
  [NoteName.G, [Accidental.Flat, Accidental.Natural, Accidental.Sharp]],
  [NoteName.A, [Accidental.Flat, Accidental.Natural, Accidental.Sharp]],
  [NoteName.B, [Accidental.Flat, Accidental.Natural]]
])

const openFretNotes: Note[] = [
  new Note(NoteName.E, Accidental.Natural),
  new Note(NoteName.B, Accidental.Natural),
  new Note(NoteName.G, Accidental.Natural),
  new Note(NoteName.D, Accidental.Natural),
  new Note(NoteName.A, Accidental.Natural),
  new Note(NoteName.E, Accidental.Natural)
]

type Props = {}
type State = {
  root: NoteName
  rootAccidental: Accidental
  degrees: Map<number, Interval>
}

// TODO: Convert the component into class.
class FretboardV2 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      root: NoteName.C,
      rootAccidental: Accidental.Natural,
      degrees: new Map<number, Interval>([
        [1, Interval.Unison],
        [2, Interval.Major],
        [3, Interval.Major],
        [4, Interval.Perfect],
        [5, Interval.Perfect],
        [6, Interval.Major],
        [7, Interval.Major]])
    }
  }

  generateFretboardGrid(scale: Map<string, Note>) {
    const rows: JSX.Element[] = []
    for (let j = 0; j <= 5; j++) {
      
      let openFretNoteStyle = {height: 35, width: 70, margin: 1}
      if (scale.has(openFretNotes[j].toString())) {
        openFretNoteStyle["background"] = "#c4f5d1"
      }
      const row: JSX.Element[] = [
        <Grid item>
          <Button variant="contained" color="default" style={openFretNoteStyle}>
            {`${openFretNotes[j]}`}
          </Button>
        </Grid>
      ]
  
      for (let i = 1; i <= NumFrets; i++) {
        let noteStyle = {height: 35, width: 70, margin: 1}
        const notes = openFretNotes[j].step(i)
        if (scale.has(notes[0].toString())) {
          noteStyle["background"] = "#c4f5d1"
        }
  
        row.push(
          <Grid item>
            <Button variant="contained" color="default" style={noteStyle}>
              {notes.map((note) => `${note}`).join(',')}
            </Button>
          </Grid>
        )
      }
  
      rows.push(
        <Grid container direction="row" justify="flex-start" alignItems="baseline" spacing={0}>
          {row}
        </Grid>
      )
    }
    return (
      <Grid
        container
        className="fretboard-grid"
        direction="row"
        justify="flex-start"
        alignItems="baseline"
        spacing={0}>
        {rows}
      </Grid>
    )
  }

  render() {
    const root: Note = new Note(this.state.root, this.state.rootAccidental)
    const scale = new Map<string, Note>()
    this.state.degrees.forEach((interval: Interval, key: number) => {
      const steps = IntervalSemitoneMapping[key].get(interval)
      if (steps !== undefined) {
        root.step(steps).forEach((note: Note) => {
          scale.set(note.toString(), note)
        })
      }
    })

    return this.generateFretboardGrid(scale)
  }
}

// TODO: Refactor this later, since most scales use only up to 7 notes. It's unlikely I need to
// deal with scalability issues.
export default function Fretboard(props: Props) {
  const [root, setRoot] = React.useState<NoteName>(NoteName.C)
  const [rootAccidental, setRootAccidental] = React.useState<Accidental>(Accidental.Natural)
  const [degree2nd, setDegree2nd] = React.useState<Interval>(Interval.Major)
  const [degree3rd, setDegree3rd] = React.useState<Interval>(Interval.Major)
  const [degree4th, setDegree4th] = React.useState<Interval>(Interval.Perfect)
  const [degree5th, setDegree5th] = React.useState<Interval>(Interval.Perfect)
  const [degree6th, setDegree6th] = React.useState<Interval>(Interval.Major)
  const [degree7th, setDegree7th] = React.useState<Interval>(Interval.Major)

  // Those degree should accept null values.
  const rootNote: Note = new Note(root, rootAccidental)
  const scaleSet = new Map<string, Note>()
  
  const degrees = [Interval.Unison, degree2nd, degree3rd, degree4th, degree5th, degree6th, degree7th]
  degrees.forEach((interval: Interval, i: number) => {
    const steps = IntervalSemitoneMapping[i].get(interval)
    if (steps !== undefined) {
      rootNote.step(steps).forEach((note: Note) => {
        scaleSet.set(note.toString(), note)
      })
    }
  })

  const rows: JSX.Element[] = []
  for (let j = 0; j <= 5; j++) {
    
    let openFretNoteStyle = {height: 35, width: 70, margin: 1}
    if (scaleSet.has(openFretNotes[j].toString())) {
      openFretNoteStyle["background"] = "#c4f5d1"
    }
    const row: JSX.Element[] = [
      <Grid item>
        <Button variant="contained" color="default" style={openFretNoteStyle}>
          {`${openFretNotes[j]}`}
        </Button>
      </Grid>
    ]

    for (let i = 1; i <= NumFrets; i++) {
      let noteStyle = {height: 35, width: 70, margin: 1}
      const notes = openFretNotes[j].step(i)
      if (scaleSet.has(notes[0].toString())) {
        noteStyle["background"] = "#c4f5d1"
      }

      row.push(
        <Grid item>
          <Button variant="contained" color="default" style={noteStyle}>
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
    switch (event.target.value as NoteName) {
      case NoteName.B:
        if (rootAccidental === Accidental.Sharp) {
          setRoot(NoteName.C)
          setRootAccidental(Accidental.Natural)
        } else {
          setRoot(event.target.value as NoteName)
        }
        break
      case NoteName.C:
        if (rootAccidental === Accidental.Flat) {
          setRoot(NoteName.B)
          setRootAccidental(Accidental.Natural)
        } else {
          setRoot(event.target.value as NoteName)
        }
        break
      case NoteName.E:
        if (rootAccidental === Accidental.Sharp) {
          setRoot(NoteName.F)
          setRootAccidental(Accidental.Natural)
        } else {
          setRoot(event.target.value as NoteName)
        }
        break
      case NoteName.F:
        if (rootAccidental === Accidental.Flat) {
          setRoot(NoteName.E)
          setRootAccidental(Accidental.Natural)
        } else {
          setRoot(event.target.value as NoteName)
        }
        break
      default:
        setRoot(event.target.value as NoteName)
    }
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

  const handleSelectRootNoteAccidental = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRootAccidental(event.target.value as Accidental)
  }

  const selectAccidentalForm: JSX.Element = (
    <FormControl>
      <InputLabel id="root-accidental-select-label">Accidental</InputLabel>
      <Select
        labelId="root-accidental-select-label"
        id="accidental-select"
        value={rootAccidental}
        onChange={handleSelectRootNoteAccidental}>
        {
          (allowedAccidentalsByNote.get(root) as []).map((accidental: Accidental): JSX.Element => (
            <MenuItem value={accidental}>{accidental}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )

  const handleSelectDegree2nd = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree2nd(event.target.value as Interval)
  }
  const select2ndDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-2-select-label">2nd</InputLabel>
      <Select
        labelId="degree-2-select-label"
        id="degree-2-select"
        value={degree2nd}
        onChange={handleSelectDegree2nd}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  const handleSelectDegree3rd = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree3rd(event.target.value as Interval)
  }
  const select3rdDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-3-select-label">3rd</InputLabel>
      <Select
        labelId="degree-3-select-label"
        id="degree-3-select"
        value={degree3rd}
        onChange={handleSelectDegree3rd}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  const handleSelectDegree4th = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree4th(event.target.value as Interval)
  }
  const select4thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-4-select-label">4th</InputLabel>
      <Select
        labelId="degree-4-select-label"
        id="degree-4-select"
        value={degree4th}
        onChange={handleSelectDegree4th}>
        <MenuItem value="Perfect">Perfect</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  const handleSelectDegree5th = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree5th(event.target.value as Interval)
  }
  const select5thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-5-select-label">5th</InputLabel>
      <Select
        labelId="degree-5-select-label"
        id="degree-5-select"
        value={degree5th}
        onChange={handleSelectDegree5th}>
        <MenuItem value="Perfect">Perfect</MenuItem>
        <MenuItem value="Diminished">Diminished</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  const handleSelectDegree6th = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree6th(event.target.value as Interval)
  }
  const select6thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-6-select-label">6th</InputLabel>
      <Select
        labelId="degree-6-select-label"
        id="degree-6-select"
        value={degree6th}
        onChange={handleSelectDegree6th}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  const handleSelectDegree7th = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDegree7th(event.target.value as Interval)
  }
  const select7thDegreeForm: JSX.Element = (
    <FormControl>
      <InputLabel id="degree-7-select-label">7th</InputLabel>
      <Select
        labelId="degree-7-select-label"
        id="degree-7-select"
        value={degree7th}
        onChange={handleSelectDegree7th}>
        <MenuItem value="Major">Major</MenuItem>
        <MenuItem value="Minor">Minor</MenuItem>
        <MenuItem value={Interval.Disabled}>{Interval.Disabled}</MenuItem>
      </Select>
    </FormControl>
  )

  return (
    <section className="Fretboard">
      <Typography>
        This is still under active development
      </Typography>
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