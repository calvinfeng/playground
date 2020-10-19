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
  Snackbar,
} from '@material-ui/core'
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';
import LogTable from './practice_log_elements/LogTable'
import LogEntryManagement from './practice_log_elements/LogEntryManagement'
import LogLabelManagement from './practice_log_elements/LogLabelManagement'
import AssignmentChecklistPopover from './practice_log_elements/AssignmentChecklistPopover'
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
  alertShown: boolean
  alertMessage: string
  alertSeverity: Color
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
      popoverAnchor: null,
      alertShown: false,
      alertMessage: "",
      alertSeverity: "info"
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

  /**
   * This is an internal class helper function to populate log labels as state.
   */
  fetchLogLabels() {
    this.http.get('/api/v2/practice/log/labels')
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
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to list log labels due to ${reason}`,
          alertSeverity: "error"
        })
      })
  }
  /**
   * This is an internal class helper function to populate log entries as state.
   * @param page indicates which page to fetch from.
   */
  fetchLogEntriesByPage(page: number) {
    this.http.get('/api/v2/practice/log/entries', {
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
            user_id: resp.data.results[i].user_id,
            labels: resp.data.results[i].labels,
            message: resp.data.results[i].message,
            details: resp.data.results[i].details,
            duration: resp.data.results[i].duration,
            assignments: resp.data.results[i].assignments
          })
        }
        // For some reason, this would set editLogEntry as null.
        this.setState({
          logEntries: entries,
          hasNextPage: resp.data.more
        })
      })
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to list log entries due to ${reason}`,
          alertSeverity: "error"
        })
      })
  }
  /**
   * This is a callback for child components to call to create a log label.
   * @param label is the log label to submit to API for create. 
   */
  handleHTTPCreateLogLabel = (label: LogLabelJSON) => {
    this.http.post(`/api/v2/practice/log/labels`, label)
    .then((resp: AxiosResponse) => {
      if (resp.status === 201) {
        this.fetchLogLabels()
        this.setState({
          alertShown: true,
          alertMessage: `Successfully created log label ${label.name}`,
          alertSeverity: "success"
        })
      }
    })
    .catch((reason: any) => {
      this.setState({
        alertShown: true,
        alertMessage: `Failed to create log label ${label.name} due to ${reason}`,
        alertSeverity: "error"
      })
    })
  }  
  /**
   * This is a callback for child components to call to update a log label.
   * @param label is the log label to submit to API for update. 
   */
  handleHTTPUpdateLogLabel = (label: LogLabelJSON) => {
    this.http.put(`/api/v2/practice/log/labels/${label.id}`, label)
    .then((resp: AxiosResponse) => {
      if (resp.status === 200) {
        this.fetchLogLabels()
        this.fetchLogEntriesByPage(this.state.pageNum)
        this.setState({
          alertShown: true,
          alertMessage: `Successfully updated log label ${label.name}`,
          alertSeverity: "success"
        })
      }
    })
    .catch((reason: any) => {
      this.setState({
        alertShown: true,
        alertMessage: `Failed to update log label ${label.name} due to ${reason}`,
        alertSeverity: "error"
      })
    })
  }
  /**
   * This is a callback for child components to call to delete a log label.
   * @param label is the log label to submit to API for delete.
   */
  handleHTTPDeleteLogLabel = (label: LogLabelJSON) => {
    this.http.delete(`/api/v2/practice/log/labels/${label.id}`)
    .then((resp: AxiosResponse) => {
      if (resp.status === 200) {
        this.fetchLogLabels()
        this.fetchLogEntriesByPage(this.state.pageNum)
        this.setState({
          alertShown: true,
          alertMessage: `Successfully deleted log label ${label.name}`,
          alertSeverity: "success"
        })
      }
    })
    .catch((reason: any) => {
      this.setState({
        alertShown: true,
        alertMessage: `Failed to delete log label ${label.name} due to ${reason}`,
        alertSeverity: "error"
      })
    })
  }
  /**
   * This is a callback for child components to call to delete a log entry.
   * @param entry is the entry to submit to API for create.
   */
  handleHTTPDeleteLogEntry = (entry: LogEntryJSON) => {
    this.http.delete(`/api/v2/practice/log/entries/${entry.id}`)
      .then((resp: AxiosResponse) => {
        if (resp.status === 200) {
          this.fetchLogEntriesByPage(this.state.pageNum)
          this.setState({
            alertShown: true,
            alertMessage: `Successfully deleted log entry ${entry.id}`,
            alertSeverity: "success"
          })
        }
      })
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to delete log entry ${entry.id} due to ${reason}`,
          alertSeverity: "error"
        })
      })
  }
  /**
   * This is a callback for child components to call to create a log entry.
   * @param entry is the entry to submit to API For create.
   */
  handleHTTPCreateLogEntry = (entry: LogEntryJSON) => {
    this.http.post(`/api/v2/practice/log/entries`, entry)
      .then((resp: AxiosResponse) => {
        if (resp.status === 201) {
          this.fetchLogEntriesByPage(this.state.pageNum)
          this.setState({
            alertShown: true,
            alertMessage: "Successfully created new log entry",
            alertSeverity: "success"
          })
        }
      })
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to create log entry due to ${reason}`,
          alertSeverity: "error"
        })
      })
  }
  /**
   * This is a callback for child components to call to update a log entry.
   * It is unnecessary to refresh the page with a HTTP request. I expect frequent update here.
   * @param entry is the entry to submit to API for assignments update.
   */
  handleHTTPUpdateLogAssignments = (entry: LogEntryJSON) => {
    this.http.put(`/api/v2/practice/log/entries/${entry.id}/assignments`, entry)
      .then((resp: AxiosResponse) => {
        const updatedEntry: LogEntryJSON = resp.data
        const entries = this.state.logEntries
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].id === updatedEntry.id) {
            entries[i] = {
              id: resp.data.id,
              date: new Date(resp.data.date),
              user_id: resp.data.user_id,
              labels: resp.data.labels,
              message: resp.data.message,
              details: resp.data.details,
              duration: resp.data.duration,
              assignments: resp.data.assignments
            }
            break
          }
        }
        this.setState({
          logEntries: entries,
          viewLogEntry: updatedEntry,
          alertShown: true,
          alertSeverity: "success",
          alertMessage: `Successfully updated entry ${entry.id} assignments`
        })
      })
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to update log entry assignment due to ${reason}`,
          alertSeverity: "error"
        })
      })
  }
  /**
   * This is a callback for child components to call to update a log entry.
   * It is unnecessary to refresh the page with a HTTP request. I expect frequent update here.
   * @param entry is the entry to submit to API for update.
   */
  handleHTTPUpdateLogEntry = (entry: LogEntryJSON) => {
    this.http.put(`/api/v2/practice/log/entries/${entry.id}`, entry)
      .then((resp: AxiosResponse) => {
        const updatedEntry: LogEntryJSON = resp.data
        const entries = this.state.logEntries
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].id === updatedEntry.id) {
            entries[i] = {
              id: resp.data.id,
              date: new Date(resp.data.date),
              user_id: resp.data.user_id,
              labels: resp.data.labels,
              message: resp.data.message,
              details: resp.data.details,
              duration: resp.data.duration,
              assignments: resp.data.assignments
            }
            break
          }
        }
        this.setState({ 
          logEntries: entries,
          editLogEntry: updatedEntry,
          alertShown: true,
          alertSeverity: "success",
          alertMessage: `Successfully updated entry ${entry.id}`
        })
      })
      .catch((reason: any) => {
        this.setState({
          alertShown: true,
          alertMessage: `Failed to update log entry due to ${reason}`,
          alertSeverity: "error"
        })
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
    const handleClearPopoverAnchorEl = () => this.setState({ popoverAnchor: null, viewLogEntry: null })
    const handleSetLogEntryEdit = (log: LogEntryJSON) => this.setState({ editLogEntry: log })
    const handleClearLogEntryEdit = () => this.setState({ editLogEntry: null })
    const handleSetLogEntryViewAndAnchorEl = (event: React.MouseEvent<HTMLButtonElement>, log: LogEntryJSON) => {
      this.setState({
        viewLogEntry: log,
        popoverAnchor: event.currentTarget 
      })
    }
    const handleCloseAlert = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason !== 'clickaway') {
        this.setState({alertShown: false});
      }
    };

    // Due to the lack of a Redux store, function to set states have to be passed around.
    // TODO Pass editLogEntry to LogAssignmentManagement
    return (
      <section className="PracticeLog">
        <AssignmentChecklistPopover 
          viewLogEntry={this.state.viewLogEntry} 
          popoverAnchor={this.state.popoverAnchor} 
          handleClearAssignment={handleClearPopoverAnchorEl} 
          handleHTTPUpdateLogAssignments={this.handleHTTPUpdateLogAssignments} /> 
        <LogTable
          logEntries={this.state.logEntries} 
          handleSetLogEntryViewAndAnchorEl={handleSetLogEntryViewAndAnchorEl}
          handleSetLogEntryEdit={handleSetLogEntryEdit}
          handleHTTPDeleteLogEntry={this.handleHTTPDeleteLogEntry} />
        {this.PaginationControlPanel}
        <LogEntryManagement
          logLabels={this.state.logLabels} 
          editLogEntry={this.state.editLogEntry}
          handleClearEditLogEntry={handleClearLogEntryEdit} 
          handleHTTPUpdateLogEntry={this.handleHTTPUpdateLogEntry}
          handleHTTPCreateLogEntry={this.handleHTTPCreateLogEntry} />
        <LogLabelManagement
          handleHTTPCreateLogLabel={this.handleHTTPCreateLogLabel}
          handleHTTPUpdateLogLabel={this.handleHTTPUpdateLogLabel}
          handleHTTPDeleteLogLabel={this.handleHTTPDeleteLogLabel}
          logLabels={this.state.logLabels} />
        <Snackbar open={this.state.alertShown} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={this.state.alertSeverity}>
            {this.state.alertMessage}
          </Alert>
        </Snackbar>
      </section>
    )
  }
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
