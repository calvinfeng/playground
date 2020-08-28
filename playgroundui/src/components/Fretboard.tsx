import React from 'react'
import './Fretboard.scss'
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core'
import { Note, NoteName, Accidental } from '../music_theory/note'

type Props = {}

const NumFrets = 15
const Notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B']


function getNote(i: number): string {
  if (i < 0) {
    i = i % 12 + 12
  } else if (i > 11) {
    i %= 12
  }
  return Notes[i]
}

export default function Fretboard(props: Props) {
  // const [root, setRoot] = React.useState<string>('c')
  const rows: JSX.Element[] = []

  const openFretNotes: number[] = [4, 11, 7, 2, 9, 4]
  for (let j = 0; j <= 5; j++) {
    const row: JSX.Element[] = [
      <Grid item>
        <Button variant="contained" color="default" style={{height: 35, width: 70, margin: 1}}>
          {getNote(openFretNotes[j])}
        </Button>
      </Grid>
    ]

    for (let i = 1; i <= NumFrets; i++) {
      row.push(
        <Grid item>
          <Button variant="contained" color="default" style={{height: 35, width: 70, margin: 1}}>
            {getNote(openFretNotes[j] + i)}
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

  let root = new Note(NoteName.E, Accidental.Natural)
  console.log(`${root}`)
  for (let i = 1; i <= 12; i++) {
    let nextNotes = root.step(i)
    console.log(`${nextNotes}`)
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
    </section>
  )
}