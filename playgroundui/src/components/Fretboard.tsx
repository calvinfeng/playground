import React from 'react'
import './Fretboard.scss'

type Props = {}

export default function Timeline(props: Props) {
  const [root, setRoot] = React.useState<string>('c')
  
  const generateClickHandler = (key: string) => () => {
    setRoot(key)
  }

  const buttons = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((key: string) => {
    return <button onClick={generateClickHandler(key.toLowerCase())}>{`${key} Major`}</button>
  })

  return (
    <div className='Fretboard'>
    {buttons}
    <iframe
      src={`https://fretmap.app/scale-major/root-${root}/hand-right`}
      width="100%"
      height="600" />
    </div>
  )
}