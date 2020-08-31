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
  IconButton
} from '@material-ui/core'
import {
  MusicNote
} from '@material-ui/icons'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import LogEntryManagement from './elements/LogEntryManagement'
import LabelManagement from './elements/LabelManagement'

type Props = {

}

type State = {
  logEntries: LogEntryJSON[]
  logLabels: LogLabelJSON[]
  editLogEntry: LogEntryJSON | null
}

const mockLogEntries: LogEntryJSON[] = [
  {
    id: "1234-1234-1234-1234",
    duration: 30,
    date: new Date(),
    labels: [
      {
        id: "0000-0000-0000-1000",
        parent_id: null,
        name: "Song",
        children: []
      },
      {
        id: "0000-0000-0000-1001",
        parent_id: "0000-0000-0000-1000",
        name: "Now & Forever",
        children: []
      }
    ],
    message: "100 BPM at 93% Speed"
  }
]

const mockLabels: LogLabelJSON[] = [
  {
    id: "0000-0000-0000-1000",
    parent_id: null,
    name: "Song",
    children: ["0000-0000-0000-1001", "0000-0000-0000-1002", "0000-0000-0000-1003", "0000-0000-0000-1004"]
  },
  {
    id: "0000-0000-0000-1001",
    parent_id: "0000-0000-0000-1000",
    name: "Now & Forever",
    children: []
  },
  {
    id: "0000-0000-0000-1002",
    parent_id: "0000-0000-0000-1000",
    name: "The Final Countdown",
    children: []
  },
  {
    id: "0000-0000-0000-1003",
    parent_id: "0000-0000-0000-1000",
    name: "Layla",
    children: []
  },
  {
    id: "0000-0000-0000-1004",
    parent_id: "0000-0000-0000-1000",
    name: "Game of Thrones",
    children: []
  },
  {
    id: "0000-0000-0000-2000",
    parent_id: null,
    name: "Scales",
    children: ["0000-0000-0000-2001", "0000-0000-0000-2002"]
  },
  {
    id: "0000-0000-0000-2001",
    parent_id: "0000-0000-0000-2000",
    name: "Major Scale",
    children: []
  },
  {
    id: "0000-0000-0000-2002",
    parent_id: "0000-0000-0000-2000",
    name: "Minor Scale",
    children: []
  },
  {
    id: "0000-0000-0000-3000",
    parent_id: null,
    name: "Finger Gym",
    children: []
  },
]

// TODO: Data will be fetched from API
export default class PracticeLog extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      logEntries: mockLogEntries,
      logLabels: mockLabels,
      editLogEntry: null
    }
  }

  newHandlerLogEntryEdit = (log: LogEntryJSON) => () => {
    this.setState({
      editLogEntry: log
    })
  }

  handleLogEntryEditClear = () => {
    this.setState({
      editLogEntry: null
    })
  }

  render() {
    const tableRows: JSX.Element[] = []
    this.state.logEntries.forEach((log: LogEntryJSON) => {
      const style = {
        "margin": "0.1rem"
      }
      const labels: JSX.Element[] = log.labels.map((label: LogLabelJSON) => (
        <Chip style={style} label={label.name} icon={<MusicNote />} color="primary" />
      ))
      
      tableRows.push(
        <TableRow>
          <TableCell>{log.date.toDateString()}</TableCell>
          <TableCell>{labels}</TableCell>
          <TableCell>{log.duration}</TableCell>
          <TableCell>{log.message}</TableCell>
          <TableCell>
          <IconButton
            color="primary"
            component="span"
            onClick={this.newHandlerLogEntryEdit(log)}>
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
        <TableContainer style={{ marginTop: "1rem" }}component={Paper}>
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
        <LogEntryManagement
          clearEditLogEntry={this.handleLogEntryEditClear}
          editLogEntry={this.state.editLogEntry}
          logLabels={this.state.logLabels} />
        <LabelManagement
          logLabels={this.state.logLabels} />
      </section>
    )
  }
}