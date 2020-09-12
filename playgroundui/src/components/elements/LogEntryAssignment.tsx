import React from 'react'
import {
  Popover,
  Typography,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  Checkbox
} from '@material-ui/core'
import { LogEntryJSON, LogAssignmentJSON } from '../types'
import { } from '@material-ui/core'
import './LogEntryAssignment.scss'

type Props = {
  popoverAnchor: HTMLButtonElement | null
  handleClearAssignment: () => void
  viewLogEntry: LogEntryJSON | null
}

export default function LogEntryAssignment(props: Props) {
  let assignments: LogAssignmentJSON[] = []
  if (props.viewLogEntry !== null && props.viewLogEntry.assignments) {
    assignments = props.viewLogEntry.assignments
  }

  const handleBoxCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked)
  } 

  const content = (
    <TableContainer component={Paper} className="table-content">
      <Table className={"assignment-list-table-view"} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Item</TableCell>
            <TableCell align="center">Done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            assignments.map((assignment: LogAssignmentJSON) => (
              <TableRow key={`assignment-item-${assignment.position}`}>
                <TableCell align="left">
                  {assignment.name}
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    onChange={handleBoxCheck}
                    checked={assignment.completed}
                    inputProps={{ 'aria-label': 'primary checkbox' }} />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Popover
      className="LogEntryAssignment"
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