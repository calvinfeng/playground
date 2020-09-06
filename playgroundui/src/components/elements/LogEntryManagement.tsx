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
  inputFieldTitle: string
  selectorFieldLabelID: string | null
}

const defaultState: State = {
  mode: Mode.Add,
  inputFieldLogID: "",
  inputFieldDate: new Date(),
  inputFieldLabels: [],
  inputFieldDuration: 0,
  inputFieldTitle: "",
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
        inputFieldTitle: props.editLogEntry.title,
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
        inputFieldTitle: nextProps.editLogEntry.title,
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
      inputFieldTitle: ev.target.value
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

  handleLabelAdd = () => {
    if (this.state.selectorFieldLabelID === null) {
      return
    }

    const found = this.state.inputFieldLabels.find(
      (label: LogLabelJSON) => label.id === this.state.selectorFieldLabelID
    )

    if (found) {
      return
    }

    const labelToAdd = this.props.logLabels.find(
      (label: LogLabelJSON) => label.id === this.state.selectorFieldLabelID
    )

    if (labelToAdd) {
      this.setState({
        inputFieldLabels: [...this.state.inputFieldLabels, labelToAdd]
      })
    } 
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
          value={this.state.inputFieldTitle}
          onChange={this.handleMessageChange}
          fullWidth
          InputLabelProps={{ shrink: true }} />
      </section>
    )
  }

  get submission() {
    const buttonStyle = { margin: "0.1rem" }
    let buttonGridItems: JSX.Element[]
    switch (this.state.mode) {
      case Mode.Edit:
        buttonGridItems = [
          <Grid item>
            <Button
              style={buttonStyle}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() => console.log(this.state)}>
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
            <Button style={buttonStyle} variant="contained" color="primary" startIcon={<AddIcon />}>
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

