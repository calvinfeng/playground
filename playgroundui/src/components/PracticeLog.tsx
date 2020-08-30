import React from 'react'
import './PracticeLog.scss'
import {
  LogEntryJSON,
  LogLabelJSON
} from './types'
import {
  Typography,
  Chip,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  IconButton
} from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import {
  MusicNote
} from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import LogEntryInput from './elements/LogEntryInput'

type Props = {

}

type State = {
  logEntries: LogEntryJSON[]
}

export default class PracticeLog extends React.Component<Props, State> {
  // TODO: Data will be fetched from API
  constructor(props) {
    super(props)
    this.state = {
      logEntries: [
        {
          id: "1234-1234-1234-1234",
          duration: 30,
          date: new Date(),
          labels: [
            {
              id: "abcd-abcd-abcd-abcd",
              parent_id: null,
              name: "Song",
              children: []
            },
            {
              id: "bcde-bcde-bcde-bcde",
              parent_id: "abcd-abcd-abcd-abcd",
              name: "Now & Forever",
              children: []
            }
          ],
          message: "100 BPM at 93% Speed"
        }
      ]
    }
  }

  handleDelete = () => {}

  handleDateChange = () => {}

  render() {
    const tableRows: JSX.Element[] = []
    this.state.logEntries.forEach((log: LogEntryJSON) => {
      const labels: JSX.Element[] = log.labels.map((label: LogLabelJSON) => (
        <Chip label={label.name} icon={<MusicNote />} color="primary" onDelete={this.handleDelete} />
      ))
      
      // TODO: Show this date picker in edit mode
      const date: JSX.Element = (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Date"
            value={log.date}
            onChange={this.handleDateChange} />
        </MuiPickersUtilsProvider>
      )

      tableRows.push(
        <TableRow>
          <TableCell>{log.date.toDateString()}</TableCell>
          <TableCell>{labels}</TableCell>
          <TableCell>{log.duration}</TableCell>
          <TableCell>{log.message}</TableCell>
          <TableCell>
          <IconButton color="primary" component="span">
            <EditIcon />
          </IconButton>
          <IconButton color="secondary" component="span">
            <DeleteIcon />
          </IconButton>
          </TableCell>
        </TableRow>
      )
    })
    return (
      <section className="PracticeLog">
        <Typography variant="h3">Practice Log</Typography>
        <div className="log-entries">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Labels</TableCell>
                  <TableCell>Duration (in minutes)</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <LogEntryInput
          editLog={this.state.logEntries[0]}
          labels={[]} />
      </section>
    )
  }
}