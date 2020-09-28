import React from 'react'
import './LogEntryManagement.scss'
import DateFnsUtils from '@date-io/date-fns'
import {
  LogAssignmentJSON,
  LogEntryJSON,
  LogLabelJSON
} from '../types'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { 
  Grid, Chip, Typography, Button, Slider, TextField, FormControl, Select, MenuItem, InputLabel,
  Paper, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import { MusicNote } from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

type Props = {
  logLabels: LogLabelJSON[]
  editLogEntry: LogEntryJSON | null
  handleClearEditLogEntry: () => void
  handleHTTPCreateLogEntry: (logEntry: LogEntryJSON) => void
  handleHTTPUpdateLogEntry: (logEntry: LogEntryJSON) => void
}

type State = {
  mode: Mode
  inputFieldLogID: string | null
  inputFieldDate: Date | null
  inputFieldDuration: number
  inputFieldMessage: string
  inputFieldNewAssignmentName: string
  inputFieldLabels: LogLabelJSON[]
  inputFieldAssignments: LogAssignmentJSON[]
  selectorFieldLabelID: string | null
}

enum Mode {
  Edit = "EDIT",
  Add = "ADD"
}

const defaultState: State = {
  mode: Mode.Add,
  inputFieldLogID: "",
  inputFieldDate: new Date(),
  inputFieldDuration: 0,
  inputFieldMessage: "",
  inputFieldLabels: [],
  inputFieldNewAssignmentName: "",
  inputFieldAssignments: [],
  selectorFieldLabelID: null
}

export default class LogEntryManagement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    if (props.editLogEntry === null) {
      this.state = defaultState
    } else {
      let mode: Mode = Mode.Edit
      if (props.editLogEntry.id.length === 0) {
        mode = Mode.Add
      }

      this.state = {
        mode: mode,
        inputFieldLogID: props.editLogEntry.id,
        inputFieldDate: props.editLogEntry.date,
        inputFieldDuration: props.editLogEntry.duration,
        inputFieldLabels: props.editLogEntry.labels,
        inputFieldMessage: props.editLogEntry.message,
        inputFieldAssignments: props.editLogEntry.assignments,
        selectorFieldLabelID: null,
        inputFieldNewAssignmentName: ""
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.editLogEntry === null) {
      this.setState(defaultState)
      return
    }

    let mode: Mode = Mode.Edit
    if (nextProps.editLogEntry.id.length === 0) {
      mode = Mode.Add
    }

    this.setState({
      mode: mode,
      inputFieldLogID: nextProps.editLogEntry.id,
      inputFieldDate: nextProps.editLogEntry.date,
      inputFieldDuration: nextProps.editLogEntry.duration,
      inputFieldLabels: nextProps.editLogEntry.labels,
      inputFieldMessage: nextProps.editLogEntry.message,
      inputFieldAssignments: nextProps.editLogEntry.assignments,
      selectorFieldLabelID: null,
      inputFieldNewAssignmentName: ""
    })
  }

  isLabelSelectedAlready(labelID: string): boolean {
    const found = this.state.inputFieldLabels.find(
      (label: LogLabelJSON) => label.id === labelID
    )
    return Boolean(found)
  }

  findLabelFromProps(labelID: string): LogLabelJSON | undefined {
    return this.props.logLabels.find(
      (label: LogLabelJSON) => label.id === labelID
    )
  }

  get header() {
    switch (this.state.mode) {
      case Mode.Edit:
        return <Typography variant="h5">Edit Log Entry {this.state.inputFieldLogID}</Typography>
      case Mode.Add:
        return <Typography variant="h5">Add Log Entry</Typography>
    }
  }

  get editPanelDate() {
    const handleDateChange = (date: MaterialUiPickersDate) => {
      this.setState({ inputFieldDate: date })
    }

    return (
      <section className="edit-panel-date">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            label="Date"
            value={this.state.inputFieldDate}
            onChange={handleDateChange} />
        </MuiPickersUtilsProvider>
      </section>
    )
  }

  get editPanelLabels() {
    if (this.props.logLabels.length === 0) {
      return <div></div>
    }

    const newHandlerRemoveLabel = (labelID: string) => () => {
      this.setState({
       inputFieldLabels: this.state.inputFieldLabels.filter((label: LogLabelJSON) => {
         return label.id !== labelID
       })
      }) 
    }

    const chips = this.state.inputFieldLabels.map((label: LogLabelJSON) => {
      return (
        <Grid item>
          <Chip 
            style={{ margin: "0.1rem" }}
            label={label.name}
            icon={<MusicNote />}
            color="primary"
            onDelete={newHandlerRemoveLabel(label.id)} />
        </Grid>
      )
    })

    const handleLabelAdd = () => {
      if (this.state.selectorFieldLabelID === null) {
        return
      }
  
      if (this.isLabelSelectedAlready(this.state.selectorFieldLabelID)) {
        return
      }
  
      const newInputFieldLabels = [...this.state.inputFieldLabels]
  
      const labelToAdd = this.findLabelFromProps(this.state.selectorFieldLabelID)
      if (labelToAdd) {
        newInputFieldLabels.push(labelToAdd)
      }
      
      if (labelToAdd && 
          labelToAdd.parent_id !== null &&
          !this.isLabelSelectedAlready(labelToAdd.parent_id)
      ) {
          const parentToAdd = this.findLabelFromProps(labelToAdd.parent_id)
          if (parentToAdd) {
            newInputFieldLabels.push(parentToAdd)
          }      
        }
      this.setState({ inputFieldLabels: newInputFieldLabels })
    }
     
    const handleSelectorFieldLabelChange = (ev: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      this.setState({
        selectorFieldLabelID: ev.target.value as string
      })
    }

    return (
      <section className="edit-panel-labels">
        <Grid direction="row" justify="flex-start" alignItems="center" container spacing={0}>
          {chips}
        </Grid>
        <Grid direction="row" justify="flex-end" alignItems="flex-end" container spacing={0}>
          <Grid item>
          <FormControl style={{width: "200px"}}>
            <InputLabel id="label-selector-label">Label</InputLabel>
              <Select
                labelId="label-selector-label"
                id="label-selector"
                value={this.state.selectorFieldLabelID}
                onChange={handleSelectorFieldLabelChange}>
                  {this.props.logLabels.map((label: LogLabelJSON) => {
                    return <MenuItem value={label.id}>
                      {label.name}
                    </MenuItem>
                  })}
              </Select>
          </FormControl>  
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" style={{marginLeft: "0.5rem"}} onClick={handleLabelAdd}
              startIcon={<AddIcon/>}>
              Add Label
            </Button>
          </Grid>
        </Grid>
      </section>
    )
  }

  get editPanelDuration() {
    const handleDurationChange = (_: React.ChangeEvent<{}>, value: unknown) => {
      this.setState({ inputFieldDuration: value as number })
    }

    return (
      <section className="edit-panel-duration">
        <Typography id="discrete-minute-slider" gutterBottom>
          Duration: {this.state.inputFieldDuration} minutes
        </Typography>
        <Slider
          defaultValue={0}
          value={this.state.inputFieldDuration}
          onChange={handleDurationChange}
          aria-labelledby="discrete-minute-slider"
          valueLabelDisplay="auto"
          step={5}
          marks={true}
          min={0}
          max={120} />
      </section>
    )
  }

  get editPanelMessage() {
    const handleMessageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ inputFieldMessage: ev.target.value })
    }

    return (
      <section className="edit-panel-message">
        <TextField
          label="Log Message"
          value={this.state.inputFieldMessage}
          onChange={handleMessageChange}
          fullWidth
          InputLabelProps={{ shrink: true }} />
      </section>
    )
  }

  get editPanelAssignmentList() {
    if (!Boolean(this.state.inputFieldAssignments)) {
      return <List dense={false}></List>
    }

    // Optional Input: event: React.MouseEvent<HTMLButtonElement, MouseEvent> for button
    const newHandlerDeleteAssignment = (assignment: LogAssignmentJSON) => () => {
      const newAssignments = [...this.state.inputFieldAssignments]
      newAssignments.splice(assignment.position, 1)
      for (let i = 0; i < newAssignments.length; i++) {
        newAssignments[i].position = i
      }

      this.setState({ inputFieldAssignments: newAssignments })
    }

    const items = this.state.inputFieldAssignments.map((assignment: LogAssignmentJSON) => {
      return (
        <ListItem>
          <ListItemText primary={assignment.name} secondary={`position: ${assignment.position}`} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="Delete" onClick={newHandlerDeleteAssignment(assignment)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    })

    return <List dense={false}>{items}</List>
  }

  get editPanelNewAssignment() {
    const handleNewAssignmentSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault()
      let newAssignments: LogAssignmentJSON[] = []
      if (Boolean(this.state.inputFieldAssignments)) {
        newAssignments = [...this.state.inputFieldAssignments]
      }
      newAssignments.push({
        position: newAssignments.length,
        name: this.state.inputFieldNewAssignmentName,
        completed: false
      })

      this.setState({
        inputFieldAssignments: newAssignments,
        inputFieldNewAssignmentName: ""
      })
    }

    const handleNewAssignmentNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        inputFieldNewAssignmentName: ev.target.value
      })
    }

    return (
      <form className="assignment-input" id="assignment-form" onSubmit={handleNewAssignmentSubmit}>
        <Grid container 
          direction="row" justify="flex-end" alignItems="flex-end" spacing={0} style={{ marginTop: "1rem "}}>
          <Grid item>
            <TextField
            style={{width: "500px"}}
            label="New Assignment Name"
            value={this.state.inputFieldNewAssignmentName}
            onChange={handleNewAssignmentNameChange}
            fullWidth
            InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" type="submit" form="assignment-form"
              style={{marginLeft: "0.5rem"}}>
                Add Assignment
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }

  get submission() {
    const buttonStyle = { margin: "0.1rem" }
    let buttonGridItems: JSX.Element[] = []
    switch (this.state.mode) {
      case Mode.Edit:
        buttonGridItems = [
          <Grid item>
            <Button style={buttonStyle} variant="contained" color="primary" startIcon={<SaveIcon />}
              onClick={ () => {
                const logEntry: LogEntryJSON = {
                  id: this.state.inputFieldLogID as string, 
                  user_id: "calvin.j.feng@gmail.com",  
                  date: new Date(),
                  duration: this.state.inputFieldDuration,
                  message: this.state.inputFieldMessage,
                  labels: this.state.inputFieldLabels, 
                  assignments: this.state.inputFieldAssignments,
                  details: "",
                }
                this.props.handleHTTPUpdateLogEntry(logEntry)
              }}>
              Save
            </Button>
          </Grid>,
          <Grid item>
            <Button style={buttonStyle} variant="contained" color="secondary"
              onClick={this.props.handleClearEditLogEntry}>
              Cancel
            </Button>
          </Grid>
        ]
        break
      case Mode.Add:
        buttonGridItems = [
          <Grid item>
            <Button style={buttonStyle} variant="contained" color="primary" startIcon={<AddIcon />}
              onClick={() => {
                const logEntry: LogEntryJSON = {
                  id: "00000000-0000-0000-0000-000000000000",
                  user_id: "calvin.j.feng@gmail.com",  
                  date: new Date(),
                  duration: this.state.inputFieldDuration,
                  message: this.state.inputFieldMessage,
                  labels: this.state.inputFieldLabels, 
                  assignments: this.state.inputFieldAssignments,
                  details: "",
                }
                this.props.handleHTTPCreateLogEntry(logEntry)
              }}>
              Add
            </Button>
          </Grid>
        ]
        break
    }

    return (
      <Grid container 
        direction="row" justify="flex-end" alignItems="flex-end" spacing={0} style={{ marginTop: "1rem "}}>
        {buttonGridItems}
      </Grid>
    )
  }

  render() {    
    return (
      <Paper className="LogEntryManagement">
        {this.header}
        {this.editPanelDate}
        {this.editPanelDuration}
        {this.editPanelLabels}
        {this.editPanelAssignmentList}
        {this.editPanelNewAssignment}
        {this.editPanelMessage}
        {this.submission}
      </Paper>
    )
  }
}
