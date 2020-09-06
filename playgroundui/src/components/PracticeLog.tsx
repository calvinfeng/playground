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
import axios, { AxiosInstance, AxiosResponse }  from 'axios'

type Props = {

}

type State = {
  logEntries: LogEntryJSON[]
  logLabels: LogLabelJSON[]
  editLogEntry: LogEntryJSON | null
}

export default class PracticeLog extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props) {
    super(props)
    this.state = {
      logEntries: [],
      logLabels: [],
      editLogEntry: null
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidMount() {
    this.http.get('/api/v2/practice/log/entries/')
      .then((resp: AxiosResponse) => {
        // time.Time is parsed as string. The string needs to be converted back into date object.
        const entries: LogEntryJSON[] = []
        for (let i = 0; i < resp.data.results.length; i++) {
          entries.push({
            id: resp.data.results[i].id,
            date: new Date(resp.data.results[i].date),
            labels: resp.data.results[i].labels,
            title: resp.data.results[i].title,
            note: resp.data.results[i].note,
            duration: resp.data.results[i].duration
          })
        }
        this.setState({
          logEntries: entries
        })
      })

    this.http.get('/api/v2/practice/log/labels/')
      .then((resp: AxiosResponse) => {
        const labels: LogLabelJSON[] = resp.data.results
        const childrenIDByParentID = new Map<string, string[]>()
        labels.forEach((label: LogLabelJSON) => {
          if (label.parent_id) {
            let children = childrenIDByParentID.get(label.parent_id)
            if (!children) {
              children = []
            }
            children.push(label.id)
            childrenIDByParentID.set(label.parent_id, children)
          }
        })
        labels.forEach((label: LogLabelJSON) => {
          if (childrenIDByParentID.get(label.id)) {
            label.children = childrenIDByParentID.get(label.id) as string[]
          } else {
            label.children = []
          }
        })
        console.log("got labels", labels)
        this.setState({
          logLabels: labels
        })
      })
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
    const cellStyle = {
      "padding": "8px"
    }
    this.state.logEntries.forEach((log: LogEntryJSON) => {
      const chipStyle = {
        "margin": "0.1rem",
      }

      let labels: JSX.Element[] = []
      if (log.labels) {
        labels = log.labels.map((label: LogLabelJSON) => (
          <Chip style={chipStyle} label={label.name} icon={<MusicNote />} color="primary" />
        ))
      }
      
      tableRows.push(
        <TableRow>
          <TableCell style={cellStyle}>{log.date.toDateString()}</TableCell>
          <TableCell style={cellStyle}>{labels}</TableCell>
          <TableCell style={cellStyle}>{log.duration}</TableCell>
          <TableCell style={cellStyle}>{log.title}</TableCell>
          <TableCell style={cellStyle}>
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
                <TableCell style={cellStyle}>Date</TableCell>
                <TableCell style={cellStyle}>Labels</TableCell>
                <TableCell style={cellStyle}>Duration (in minutes)</TableCell>
                <TableCell style={cellStyle}>Message</TableCell>
                <TableCell style={cellStyle}>Action</TableCell>
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