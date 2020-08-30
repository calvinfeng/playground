import React from 'react'
import './LogEntryInput.scss'
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
  TextField
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import {
  MusicNote
} from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { isThisSecond } from 'date-fns/esm'

type Props = {
  editLog: LogEntryJSON | null
  labels: LogLabelJSON[]
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
}

export default class LogEntryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    if (props.editLog === null) {
      this.state = {
        mode: Mode.Add,
        inputFieldLogID: "",
        inputFieldDate: new Date(),
        inputFieldLabels: [],
        inputFieldDuration: 0,
        inputFieldMessage: ""
      }
    } else {
      this.state = {
        mode: Mode.Edit,
        inputFieldLogID: props.editLog.id,
        inputFieldDate: props.editLog.date,
        inputFieldDuration: props.editLog.duration,
        inputFieldLabels: props.editLog.labels,
        inputFieldMessage: props.editLog.message
      }
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

  handleMessageChange = () => {

  }

  handleDurationChange = (_, value) => {
    this.setState({
      inputFieldDuration: value
    })
  }

  get header() {
    switch (this.state.mode) {
      case Mode.Edit:
        return <Typography variant="h5">Editing Log Entry {this.state.inputFieldLogID}</Typography>
      case Mode.Add:
        return <Typography variant="h5">New Log Entry</Typography>
    }
  }

  get editPanelDate() {
    return (
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
    )
  }

  get editPanelLabels() {
    const style = {
      "margin": "0.1rem"
    }
    const chips = this.state.inputFieldLabels.map((label: LogLabelJSON) => {
      return (
        <Chip 
          style={style}
          label={label.name}
          icon={<MusicNote />}
          color="primary"
          onDelete={this.newHandlerRemoveLabel(label.id)} />
      )
    })
    return (
      <Grid
        direction="row"
        justify="flex-start"
        alignItems="center"
        container
        spacing={2}>
        <Grid item>{chips}</Grid>
      </Grid>
    )
  }

  get editPanelDuration() {
    const style = {
      marginTop: "1rem",
      marginBottom: "1rem"
    }
    return (
      <div style={style}>
        <Typography id="discrete-minute-slider" gutterBottom>
          Duration: {this.state.inputFieldDuration} minutes
        </Typography>
        <Slider
          defaultValue={this.state.inputFieldDuration}
          onChange={this.handleDurationChange}
          aria-labelledby="discrete-minute-slider"
          valueLabelDisplay="auto"
          step={5}
          marks={true}
          min={0}
          max={60} />
      </div>
    )
  }

  get editPanelMessage() {
    const style = {
      marginTop: "1rem",
      marginBottom: "1rem"
    }
    return <TextField
      style={style}
      id="standard-full-width"
      label="Log Message"
      value={this.state.inputFieldMessage}
      onChange={this.handleMessageChange}
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}/>
  }

  get submission() {
    const style = {
      "margin": "0.1rem"
    }
    switch (this.state.mode) {
      case Mode.Edit:
        return <div>
          <Button style={style} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
          <Button style={style} variant="contained" color="secondary">Cancel</Button>
        </div>
      case Mode.Add:
        return <Button style={style} variant="contained" color="primary" startIcon={<AddIcon />}>
          Add
        </Button>
    }
  }

  render() {    
    return (
      <section className="LogEntryInput">
        {this.header}
        {this.editPanelDate}
        {this.editPanelDuration}
        {this.editPanelLabels}
        {this.editPanelMessage}
        {this.submission}
      </section>
    )
  }
}

