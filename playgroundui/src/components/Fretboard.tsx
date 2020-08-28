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

export default function Fretboard(props: Props) {
  const [root, setRoot] = React.useState<NoteName>(NoteName.C)

  const rows: JSX.Element[] = []

  const openFretNotes: Note[] = [
    new Note(NoteName.E, Accidental.Natural),
    new Note(NoteName.B, Accidental.Natural),
    new Note(NoteName.G, Accidental.Natural),
    new Note(NoteName.D, Accidental.Natural),
    new Note(NoteName.A, Accidental.Natural),
    new Note(NoteName.E, Accidental.Natural)
  ]

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

  const handleSelectRootNote = () => {

  }

  return (
    <section className="Fretboard">
      <Typography variant="h1">Interactive Fretboard</Typography>
      <Grid
        direction="row"
        justify="flex-start"
        alignItems="baseline"
        container
        spacing={0}>
        {rows}
      </Grid>
      <Typography variant="body1">Feature is under construction</Typography>
      <FormControl className="fretboard-select">
        <InputLabel id="root-select-label">Root</InputLabel>
        <Select
          labelId="root-select-label"
          id="root-select"
          value={root}
          onChange={handleSelectRootNote}>
          <MenuItem value={NoteName.C}>{NoteName.C}</MenuItem>
          <MenuItem value={NoteName.D}>{NoteName.D}</MenuItem>
          <MenuItem value={NoteName.E}>{NoteName.E}</MenuItem>
        </Select>
      </FormControl>
    </section>
  )
}