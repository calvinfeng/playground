
export enum NaturalNote {
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  A = "A",
  B = "B",
}

export enum Accidental {
  Natural = "",
  Sharp = "#",
  Flat = "b"
}

const chromaticOrder: (NaturalNote|null)[]= [
  NaturalNote.C,
  null,
  NaturalNote.D,
  null,
  NaturalNote.E,
  NaturalNote.F,
  null,
  NaturalNote.G,
  null,
  NaturalNote.A,
  null,
  NaturalNote.B
]

const naturalOrder: NaturalNote[] = [
  NaturalNote.C,
  NaturalNote.D,
  NaturalNote.E,
  NaturalNote.F,
  NaturalNote.G,
  NaturalNote.A,
  NaturalNote.B
]

function nextNaturalNote(note: NaturalNote): NaturalNote {
  for (let i = 0; i < naturalOrder.length; i++) {
    if (note === naturalOrder[i]) {
      if (i + 1 >= naturalOrder.length) {
        return naturalOrder[i + 1 - naturalOrder.length]
      }
      return naturalOrder[i+1]
    }
  }
  throw "natural note not found"
}

function chromaticIndexOf(note: NaturalNote, accidental: Accidental): number {
  for (let i = 0; i < chromaticOrder.length; i++) {
    if (chromaticOrder[i] !== null && chromaticOrder[i] === note) {
      switch (accidental) {
        case Accidental.Natural:
          return i
        case Accidental.Flat:
          if (i - 1 < 0) {
            return i + 12
          }
          return i - 1
        case Accidental.Sharp:
          if (i + 1 >= chromaticOrder.length) {
            return i + 1 - chromaticOrder.length
          }
          return i + 1
      }
    }
  }
  return -1
}

export class Note {
  private note: NaturalNote
  private accidental: Accidental

  constructor(note: NaturalNote, accidental: Accidental) {
    this.note = note
    this.accidental = accidental  
  }

  wholeUp(): Note{
    const i = chromaticIndexOf(this.note, this.accidental)
    const nextNote = nextNaturalNote(this.note)
    const j = chromaticIndexOf(nextNote, Accidental.Natural)
    let delta = j - i
    if (delta < 0) {
      delta += chromaticOrder.length
    }
    if (delta === 1) {
      // Basically + 1
      return new Note(nextNote, Accidental.Sharp)
    } else if (delta === 2) {
      // Basically doing nothing
      return new Note(nextNote, Accidental.Natural)
    } else {
      // Basically - 1
      return new Note(nextNote, Accidental.Flat)
    }
  }

  halfUp(): Note {
    const i = chromaticIndexOf(this.note, this.accidental)
    const nextNote = nextNaturalNote(this.note)
    const j = chromaticIndexOf(nextNote, Accidental.Natural)
    const delta = j - i
    if (delta === 1) {
      return new Note(nextNote, Accidental.Natural)
    } else {
      return new Note(nextNote, Accidental.Flat)
    }
  }
}