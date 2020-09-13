import React from 'react'
import './PracticeLog.scss'
import {
  LogEntryJSON,
  LogLabelJSON
} from './types'
import {
  Typography,
  Grid,
  Button,
  Popover
} from '@material-ui/core'
import LogEntryManagement from './elements/LogEntryManagement'
import LogLabelManagement from './elements/LogLabelManagement'
import LogEntryAssignment from './elements/LogEntryAssignment'
import LogTable from './elements/LogTable'
import axios, { AxiosInstance, AxiosResponse }  from 'axios'

type Props = {}

type State = {
  logEntries: LogEntryJSON[]
  logLabels: LogLabelJSON[]
  editLogEntry: LogEntryJSON | null
  viewLogEntry: LogEntryJSON | null
  pageNum: number
  hasNextPage: boolean
  popoverAnchor: HTMLButtonElement | null
}

export default class PracticeLog extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props) {
    super(props)
    this.state = {
      logEntries: [],
      logLabels: [],
      editLogEntry: null,
      viewLogEntry: null,
      pageNum: 1,
      hasNextPage: false,
      popoverAnchor: null
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.pageNum !== prevState.pageNum) {
      this.fetchLogEntriesByPage(this.state.pageNum)
    }
  }

  componentDidMount() {
    this.fetchLogEntriesByPage(this.state.pageNum)
    this.fetchLogLabels()
  }

  fetchLogLabels() {
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
          console.log(resp.data.results[i].assignments)
          entries.push({
            id: resp.data.results[i].id,
            date: new Date(resp.data.results[i].date),
            labels: resp.data.results[i].labels,
            title: resp.data.results[i].title,
            note: resp.data.results[i].note,
            duration: resp.data.results[i].duration,
            assignments: resp.data.results[i].assignments
          })
        }
        this.setState({
          logEntries: entries,
          hasNextPage: resp.data.more
        })
      })
  }

  handleUpdateLogAssignments = (entry: LogEntryJSON) => {
    this.http.put(`/api/v2/practice/log/entries/${entry.id}/assignments/`, entry)
      .then((resp: AxiosResponse) => {
        const updatedEntry: LogEntryJSON = resp.data
        const entries = this.state.logEntries
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].id === updatedEntry.id) {
            entries[i] = {
              id: resp.data.id,
              date: new Date(resp.data.date),
              labels: resp.data.labels,
              title: resp.data.title,
              note: resp.data.note,
              duration: resp.data.duration,
              assignments: resp.data.assignments
            }
            break
          }
        }
        this.setState({ logEntries: entries, viewLogEntry: updatedEntry })
      })
  }

  handleSetLogEntryViewAndAnchorEl = (event: React.MouseEvent<HTMLButtonElement>, log: LogEntryJSON) => {
    this.setState({
      viewLogEntry: log,
      popoverAnchor: event.currentTarget 
    })
  }

  handleClearAnchorEl = () => {
    this.setState({
      popoverAnchor: null
    })
  }

  handleClearLogEntryView = () => {
    this.setState({
      viewLogEntry: null
    })
  }

  handleSetLogEntryEdit = (log: LogEntryJSON) => {
    this.setState({
      editLogEntry: log
    })
  }

  handleClearLogEntryEdit = () => {
    this.setState({
      editLogEntry: null
    })
  }

  get PaginationControlPanel() {
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
    // Due to the lack of a Redux store, function to set states have to be passed around.
    return (
      <section className="PracticeLog">
        <LogEntryAssignment 
          handleUpdateLogAssignments={this.handleUpdateLogAssignments}
          handleClearAssignment={this.handleClearAnchorEl}
          popoverAnchor={this.state.popoverAnchor} 
          viewLogEntry={this.state.viewLogEntry} /> 
        <LogTable
          logEntries={this.state.logEntries} 
          handleSetLogEntryViewAndAnchorEl={this.handleSetLogEntryViewAndAnchorEl}
          handleSetLogEntryEdit={this.handleSetLogEntryEdit} />
        {this.PaginationControlPanel}
        <LogEntryManagement
          clearEditLogEntry={this.handleClearLogEntryEdit}
          editLogEntry={this.state.editLogEntry}
          logLabels={this.state.logLabels} />
        <LogLabelManagement
          logLabels={this.state.logLabels} />
      </section>
    )
  }
}