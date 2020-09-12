import React from 'react'
import { Popover, Typography, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core'
import { LogEntryJSON, LogAssignmentJSON } from '../types'
import { List } from '@material-ui/icons'

type Props = {
  popoverAnchor: HTMLButtonElement | null
  handleClearAssignment: () => void
  viewLogEntry: LogEntryJSON | null
}

export default function LogEntryAssignment(props: Props) {
  let content: JSX.Element

  if (props.viewLogEntry === null || !props.viewLogEntry.assignments || props.viewLogEntry.assignments.length === 0) {
    content = <Typography>No Assignment Found</Typography>
  } else {
    content = (
      <List style={{width: "100%"}}>
        {
        props.viewLogEntry.assignments.map((assignment: LogAssignmentJSON) => {
          const labelId = `assignment-checkbox-label-${assignment.position}`;
          console.log("HELLLO?", assignment)
          return (
            <ListItem key={assignment.position}>
              <Typography>HELLO?</Typography>
            </ListItem>
          )
        })
        }

      </List>
    )
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