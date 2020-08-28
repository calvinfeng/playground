
export enum NoteName {
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  A = "A",
  B = "B",
}

export enum Accidental {
  Natural = "Natural",
  Sharp = "Sharp",
  Flat = "Flat"
}

type NoteConfig = {
  NoteName: NoteName
  Accidental: Accidental
}

// Chromatic order needs to factor in enharmonic notes.
const chromaticNoteOrder: NoteConfig[][] = [
  [
    { NoteName: NoteName.C, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.C, Accidental: Accidental.Sharp }, 
    { NoteName: NoteName.D, Accidental: Accidental.Flat }
  ],
  [
    { NoteName: NoteName.D, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.D, Accidental: Accidental.Sharp }, 
    { NoteName: NoteName.E, Accidental: Accidental.Flat }
  ],
  [
    { NoteName: NoteName.E, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.F, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.F, Accidental: Accidental.Sharp }, 
    { NoteName: NoteName.G, Accidental: Accidental.Flat }
  ],
  [
    { NoteName: NoteName.G, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.G, Accidental: Accidental.Sharp }, 
    { NoteName: NoteName.A, Accidental: Accidental.Flat }
  ],
  [
    { NoteName: NoteName.A, Accidental: Accidental.Natural }
  ],
  [
    { NoteName: NoteName.A, Accidental: Accidental.Sharp }, 
    { NoteName: NoteName.B, Accidental: Accidental.Flat }
  ],
  [
    { NoteName: NoteName.B, Accidental: Accidental.Natural }
  ],
]

function chromaticIndexOf(note: Note): number {
  for (let i = 0; i < chromaticNoteOrder.length; i++) {
    for (let j = 0; j < chromaticNoteOrder[i].length; j++) {
      if (note.has(chromaticNoteOrder[i][j])) {
        return i
      }
    }
  }
  throw "note not found, not part of chromatic scale"
}

export class Note {
  private name: NoteName
  private accidental: Accidental
  private chromaticIndex: number

  constructor(name: NoteName, accidental: Accidental) {
    this.name = name
    this.accidental = accidental  
    this.chromaticIndex = chromaticIndexOf(this)
  }

  public toString(): string {
    switch (this.accidental) {
      case Accidental.Natural:
        return this.name
      case Accidental.Sharp:
        return `${this.name}#`
      case Accidental.Flat:
        return `${this.name}b`
    }
  }

  has(other: NoteConfig): boolean {
    return this.name === other.NoteName && this.accidental === other.Accidental
  }

  step(s: number): Note[] {
    let i = this.chromaticIndex + s
    if (i >= chromaticNoteOrder.length) {
      i %= chromaticNoteOrder.length
    } else if (i < 0) {
      i %= chromaticNoteOrder.length
      i += chromaticNoteOrder.length
    }
    
    if (chromaticNoteOrder[i] === undefined) {
      console.log("broken", i)
    }
    return chromaticNoteOrder[i].map(
      (config: NoteConfig) => new Note(config.NoteName, config.Accidental)
    )
  }
}

