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
  IconButton,
  Grid,
  Button
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
  pageNum: number
  hasNextPage: boolean
}

export default class PracticeLog extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props) {
    super(props)
    this.state = {
      logEntries: [],
      logLabels: [],
      editLogEntry: null,
      pageNum: 1,
      hasNextPage: false
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.pageNum !== prevState.pageNum) {
      this.fetchLogEntriesByPage(this.state.pageNum)
    }
  }

  componentDidMount() {
    this.fetchLogEntriesByPage(this.state.pageNum)

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
        this.setState({
          logLabels: labels
        })
      })
  }

  fetchLogEntriesByPage(page: number) {
    this.http.get('/api/v2/practice/log/entries/', {
        params: {
          "page": page
        }
      })
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
          logEntries: entries,
          hasNextPage: resp.data.more
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

  get logEntryTable() {
    const tableRows: JSX.Element[] = []
    const cellStyle = { "padding": "8px" }

    this.state.logEntries.forEach((log: LogEntryJSON) => {
      const chipStyle = { "margin": "0.1rem" }

      let labels: JSX.Element[] = []
      if (log.labels) {
        labels = log.labels.map((label: LogLabelJSON) => (
          <Chip style={chipStyle} label={label.name} icon={<MusicNote />} color="primary" />
        ))
      }

      tableRows.push(
        <TableRow>
          <TableCell style={cellStyle}>{log.date.toDateString()}</TableCell>
          <TableCell style={cellStyle}>{log.duration} minutes</TableCell>
          <TableCell style={cellStyle}>{labels}</TableCell>
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
      <TableContainer className="log-entry-table" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={cellStyle}>Date</TableCell>
            <TableCell style={cellStyle}>Duration</TableCell>
            <TableCell style={cellStyle}>Labels</TableCell>
            <TableCell style={cellStyle}>Message</TableCell>
            <TableCell style={cellStyle}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  get paginationControlPanel() {
    const handlePrevPage = () => {
      this.setState({ pageNum: this.state.pageNum - 1 })
    }

    const handleNextPage = () => {
      this.setState({ pageNum: this.state.pageNum + 1 })
    }

    const items: JSX.Element[] = []
    if (this.state.pageNum > 1) {
      items.push(
        <Grid item>
          <Button variant="contained" color="primary" onClick={handlePrevPage}>Prev</Button>
        </Grid>
      )
    }
    
    if (this.state.hasNextPage) {
      items.push(
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleNextPage}>Next</Button>
        </Grid>
      )
    }

    items.push(
      <Grid item>
        <Typography>Page {this.state.pageNum} </Typography>
      </Grid>
    )

    return (
      <Grid container
        direction="row"
        justify="flex-end"
        alignItems="baseline"
        spacing={1}
        className="pagination-control-panel">
        {items}
    </Grid>
    )
  }

  render() {
    return (
      <section className="PracticeLog">
        {this.logEntryTable}
        {this.paginationControlPanel}
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