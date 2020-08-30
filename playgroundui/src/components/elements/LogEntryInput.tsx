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
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  IconButton
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import SaveIcon from '@material-ui/icons/Save'
import {
  MusicNote
} from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

type Props = {
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

// TODO: Refactor inline style into SCSS.
export default class LogEntryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    if (props.editLogEntry === null) {
      this.state = {
        mode: Mode.Add,
        inputFieldLogID: "",
        inputFieldDate: new Date(),
        inputFieldLabels: [],
        inputFieldDuration: 0,
        inputFieldMessage: "",
        selectorFieldLabelID: null
      }
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
    if (this.props.logLabels.length === 0) {
      return <div></div>
    }
    const style = {
      "margin": "0.1rem"
    }
    const chips = this.state.inputFieldLabels.map((label: LogLabelJSON) => {
      return (
        <Grid item>
          <Chip 
            style={style}
            label={label.name}
            icon={<MusicNote />}
            color="primary"
            onDelete={this.newHandlerRemoveLabel(label.id)} />
        </Grid>
      )
    })

    const addLabelForm = (
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
    )

    const addLabelButton = (
      <IconButton style={{marginLeft: "0.5rem"}}
        onClick={this.handleLabelAdd}>
        <AddIcon/>
      </IconButton>
    )

    return (
      <section>
        <Grid
          direction="row"
          justify="flex-start"
          alignItems="center"
          container
          spacing={0}>
          {chips}
        </Grid>
        <div style={{ display: "flex", width: "100%", marginTop: "1rem", justifyContent: "flex-end" }}>
          {addLabelForm}
          {addLabelButton}
        </div>
      </section>
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
          <Button
            style={style}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={() => console.log(this.state)}>
            Save
          </Button>
          <Button
            style={style}
            variant="contained"
            color="secondary">
            Cancel
          </Button>
        </div>
      case Mode.Add:
        return <Button style={style} variant="contained" color="primary" startIcon={<AddIcon />}>
          Add
        </Button>
    }
  }

  render() {    
    return (
      <Paper className="LogEntryInput">
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

