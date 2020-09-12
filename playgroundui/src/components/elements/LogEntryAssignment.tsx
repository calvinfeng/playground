import React from 'react'
import { Popover, Typography } from '@material-ui/core'
import { LogEntryJSON } from '../types'

type Props = {
  popoverAnchor: HTMLButtonElement | null
  handleClearAssignment: () => void
  viewLogEntry: LogEntryJSON | null
}

export default function LogEntryAssignment(props: Props) {
  let content: JSX.Element

  if (props.viewLogEntry === null) {
    content = <Typography>No Entry Found</Typography>
  } else {
    content = <Typography>{(props.viewLogEntry as LogEntryJSON).title}</Typography>
  }

  return (
    <Popover
      id={"assignment-popover"}
      open={Boolean(props.popoverAnchor)}
      anchorEl={props.popoverAnchor}
      onClose={props.handleClearAssignment}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
      {content}
    </Popover>
  )
}