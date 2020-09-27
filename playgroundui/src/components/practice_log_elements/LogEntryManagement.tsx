import React from 'react'
import './LogEntryManagement.scss'
import DateFnsUtils from '@date-io/date-fns'
import {
  LogEntryJSON,
  LogLabelJSON
} from '../types'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'
import { 
  Grid, 
  Chip,
  Typography,
  Button,
  Slider,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import {
  MusicNote
} from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

type Props = {
  clearEditLogEntry: () => void
  createLogEntry: (logEntry: LogEntryJSON) => void
  editLogEntry: LogEntryJSON | null
  logLabels: LogLabelJSON[]
  // Need a function to reload the labels for every successful POST or DELETE.
  // Same for log entries. The next logical step is using Redux but later...
}

enum Mode {
  Edit = "EDIT",
  Add = "ADD"
}

type State = {
  mode: Mode
  inputFieldLogID: string | null
  inputFieldDate: Date | null
  inputFieldLabels: LogLabelJSON[]
  inputFieldDuration: number
  inputFieldMessage: string
  selectorFieldLabelID: string | null
}

const defaultState: State = {
  mode: Mode.Add,
  inputFieldLogID: "",
  inputFieldDate: new Date(),
  inputFieldLabels: [],
  inputFieldDuration: 0,
  inputFieldMessage: "",
  selectorFieldLabelID: null
}

export default class LogEntryManagement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    if (props.editLogEntry === null) {
      this.state = defaultState
    } else {
      this.state = {
        mode: Mode.Edit,
        inputFieldLogID: props.editLogEntry.id,
        inputFieldDate: props.editLogEntry.date,
        inputFieldDuration: props.editLogEntry.duration,
        inputFieldLabels: props.editLogEntry.labels,
        inputFieldMessage: props.editLogEntry.message,
        selectorFieldLabelID: null
      }
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.editLogEntry === null) {
      if (this.state.inputFieldLogID !== null) {
        this.setState(defaultState)
      }
      return
    }

    if (this.state.inputFieldLogID !== nextProps.editLogEntry.id) {
      this.setState({
        mode: Mode.Edit,
        inputFieldLogID: nextProps.editLogEntry.id,
        inputFieldDate: nextProps.editLogEntry.date,
        inputFieldDuration: nextProps.editLogEntry.duration,
        inputFieldLabels: nextProps.editLogEntry.labels,
        inputFieldMessage: nextProps.editLogEntry.message,
        selectorFieldLabelID: null
      })
    }
  }

  newHandlerRemoveLabel = (labelID: string) => () => {
   this.setState({
    inputFieldLabels: this.state.inputFieldLabels.filter((label: LogLabelJSON) => {
      return label.id !== labelID
    })
   }) 
  }

  handleDateChange = (date: MaterialUiPickersDate) => {
    this.setState({
      inputFieldDate: date
    })
  }

  handleMessageChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputFieldMessage: ev.target.value
    })
  }

  handleDurationChange = (_: React.ChangeEvent<{}>, value: unknown) => {
    this.setState({
      inputFieldDuration: value as number
    })
  }

  handleSelectorFieldLabelChange = (ev: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    this.setState({
      selectorFieldLabelID: ev.target.value as string
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

  handleLabelAdd = () => {
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

  get header() {
    switch (this.state.mode) {
      case Mode.Edit:
        return <Typography variant="h5">Edit Log Entry {this.state.inputFieldLogID}</Typography>
      case Mode.Add:
        return <Typography variant="h5">Add Log Entry</Typography>
    }
  }

  get editPanelDate() {
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
            onChange={this.handleDateChange} />
        </MuiPickersUtilsProvider>
      </section>
    )
  }

  get editPanelLabels() {
    if (this.props.logLabels.length === 0) {
      return <div></div>
    }

    const chips = this.state.inputFieldLabels.map((label: LogLabelJSON) => {
      return (
        <Grid item>
          <Chip 
            style={{ margin: "0.1rem" }}
            label={label.name}
            icon={<MusicNote />}
            color="primary"
            onDelete={this.newHandlerRemoveLabel(label.id)} />
        </Grid>
      )
    })

    return (
      <section className="edit-panel-labels">
        <Grid
          direction="row"
          justify="flex-start"
          alignItems="center"
          container
          spacing={0}>
          {chips}
        </Grid>
        <Grid
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
          container
          spacing={0}>
          <Grid item>
          <FormControl style={{width: "200px"}}>
            <InputLabel id="label-selector-label">Label</InputLabel>
              <Select
                labelId="label-selector-label"
                id="label-selector"
                value={this.state.selectorFieldLabelID}
                onChange={this.handleSelectorFieldLabelChange}>
                  {this.props.logLabels.map((label: LogLabelJSON) => {
                    return <MenuItem value={label.id}>
                      {label.name}
                    </MenuItem>
                  })}
              </Select>
          </FormControl>  
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              style={{marginLeft: "0.5rem"}}
              onClick={this.handleLabelAdd}
              startIcon={<AddIcon/>}>
              Add Label
            </Button>
          </Grid>
        </Grid>
      </section>
    )
  }

  get editPanelDuration() {
    return (
      <section className="edit-panel-duration">
        <Typography id="discrete-minute-slider" gutterBottom>
          Duration: {this.state.inputFieldDuration} minutes
        </Typography>
        <Slider
          defaultValue={0}
          value={this.state.inputFieldDuration}
          onChange={this.handleDurationChange}
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
    return (
      <section className="edit-panel-message">
        <TextField
          label="Log Message"
          value={this.state.inputFieldMessage}
          onChange={this.handleMessageChange}
          fullWidth
          InputLabelProps={{ shrink: true }} />
      </section>
    )
  }

  get submission() {
    const buttonStyle = { margin: "0.1rem" }
    let buttonGridItems: JSX.Element[] = []
    switch (this.state.mode) {
      case Mode.Edit:
        buttonGridItems = [
          <Grid item>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={ () => console.log(this.state) }>
              Save
            </Button>
          </Grid>,
          <Grid item>
            <Button
              style={buttonStyle}
              variant="contained"
              color="secondary"
              onClick={this.props.clearEditLogEntry}>
              Cancel
            </Button>
          </Grid>
        ]
        break
      case Mode.Add:
        buttonGridItems = [
          <Grid item>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                const logEntry: LogEntryJSON = {
                  id: "00000000-0000-0000-0000-000000000000",
                  date: new Date(),
                  duration: this.state.inputFieldDuration,
                  message: this.state.inputFieldMessage,
                  labels: this.state.inputFieldLabels, 
                  user_id: "calvin.j.feng@gmail.com",  
                  details: "",
                  assignments: []            
                }
                this.props.createLogEntry(logEntry)
              }}>
              Add
            </Button>
          </Grid>
        ]
        break
    }

    return (
      <Grid
        direction="row"
        justify="flex-end"
        alignItems="flex-end"
        container
        spacing={0}>
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
        {this.editPanelMessage}
        {this.submission}
      </Paper>
    )
  }
}

