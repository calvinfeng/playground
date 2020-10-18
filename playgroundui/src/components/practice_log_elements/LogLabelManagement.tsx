import React from 'react'
import './LogLabelManagement.scss'
import { LogLabelJSON } from '../types'
import {
  Grid,
  Chip,
  Paper,
  Divider,
  Typography,
  Button,
  TextField
} from '@material-ui/core'
import {
  MusicNote
} from '@material-ui/icons'
import DoneIcon from '@material-ui/icons/Done'

const nilUUID = '00000000-0000-0000-0000-000000000000'

type State = {
  selectedParentLabel: LogLabelJSON | null
  selectedChildLabel: LogLabelJSON | null
  inputParentLabelName: string
  inputChildLabelName: string
}

type Props = {
  logLabels: LogLabelJSON[] 
  handleHTTPCreateLogLabel: (label: LogLabelJSON) => void
  handleHTTPUpdateLogLabel: (label: LogLabelJSON) => void
}

export default class LabelManagement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedParentLabel: null,
      selectedChildLabel: null,
      inputParentLabelName: "",
      inputChildLabelName: ""
    }
  }

  componentDidUpdate() {

  }

  newHandlerSelectParentLabel = (label: LogLabelJSON | null) => () => {
    if (label === null) {
      this.setState({
        inputParentLabelName: "",
        selectedParentLabel: null
      })
    } else {
      this.setState({
        inputParentLabelName: label.name,
        selectedParentLabel: label
      })
    }
  }

  newHandlerSelectChildLabel = (label: LogLabelJSON | null) => () => {
    if (label === null) {
      this.setState({
        inputChildLabelName: "",
        selectedChildLabel: null
      })
    } else {
      this.setState({
        inputChildLabelName: label.name,
        selectedChildLabel: label
      })
    }
  }

  get panelParentLabels() {
    const items: JSX.Element[] = this.props.logLabels.filter((label: LogLabelJSON) => {
      return label.parent_id === nilUUID
    }).map((label: LogLabelJSON) => {
      let style = { margin: "0.1rem" }
      let handler = this.newHandlerSelectParentLabel(label)
      if (this.state.selectedParentLabel !== null && this.state.selectedParentLabel.id === label.id) {
        style["background"] = "green"
        handler = this.newHandlerSelectParentLabel(null)
      }
      return (
        <Grid item>
          <Chip
            onClick={handler}
            style={style}
            label={label.name}
            icon={<MusicNote />}
            color="primary" />
        </Grid>
      )
    })
    return (
      <Grid
        style={{ width: "30%", margin: "0.5rem" }}
        direction="row"
        justify="flex-start"
        alignItems="center"
        container
        spacing={0}>
        {items}
      </Grid>
    )
  }

  get panelChildLabels() {
    const items: JSX.Element[] = this.props.logLabels.filter((label: LogLabelJSON) => {
      if (this.state.selectedParentLabel === null) {
        return false
      }
      return label.parent_id === this.state.selectedParentLabel.id
    }).map((label: LogLabelJSON) => {      
      let style = { margin: "0.1rem" }
      let handler = this.newHandlerSelectChildLabel(label)
      if (this.state.selectedParentLabel !== null && 
        this.state.selectedChildLabel !== null &&
        this.state.selectedChildLabel.id === label.id) {
        style["background"] = "green"
        handler = this.newHandlerSelectChildLabel(null)
      }

      return (
        <Grid item>
          <Chip
            onClick={handler}
            style={style}
            label={label.name}
            icon={<MusicNote />}
            color="primary" />
        </Grid>
      )
    })

    return (
      <Grid
        style={{ width: "30%", margin: "0.5rem" }}
        direction="row"
        justify="flex-start"
        alignItems="center"
        container
        spacing={0}>
        {items}
      </Grid>
    )
  }

  get panelEditLabel() {
    const handleParentLabelNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ inputParentLabelName: ev.target.value })
    }

    const handleChildLabelNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ inputChildLabelName: ev.target.value })
    }

    const handleClickAddParentLabel = () => {
      const newLabel: LogLabelJSON = {
        id: nilUUID,
        parent_id: null,
        children: [],
        name: this.state.inputParentLabelName
      }
      this.props.handleHTTPCreateLogLabel(newLabel)
      // TODO: Use Promise!
      this.setState({ inputParentLabelName: "", inputChildLabelName: "" })
    }

    const handleClickAddNewChildLabel = () => {
      if (this.state.selectedParentLabel !== null ) {
        const newLabel: LogLabelJSON = {
          id: nilUUID,
          parent_id: this.state.selectedParentLabel.id,
          children: [],
          name: this.state.inputChildLabelName
        }
        this.props.handleHTTPCreateLogLabel(newLabel)
        // TODO: Use Promise!
        this.setState({ inputParentLabelName: "", inputChildLabelName: "" })
      }
    }

    let gridItems: JSX.Element[]

    if (this.state.selectedParentLabel !== null && this.state.selectedChildLabel !== null) {
      // Parent & child are selected
      gridItems = [
        <Grid item>
          <Typography variant="subtitle1">
            Selected Child Label: {this.state.selectedChildLabel.name}
          </Typography>
        </Grid>,
        <Grid item>
          <TextField label="Child Label Name" value={this.state.inputChildLabelName}
            onChange={handleChildLabelNameChange} fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}} variant="contained" color="primary">Update</Button>
          <Button style={{margin: "0.1rem"}} variant="contained" color="secondary">Delete</Button>
        </Grid>
      ]
    } else if (this.state.selectedParentLabel !== null && this.state.selectedChildLabel === null) {
      // Parent is selected
      gridItems = [
        <Grid item>
          <Typography variant="subtitle1">
            Selected Label: {this.state.selectedParentLabel.name}
          </Typography>
        </Grid>,
        <Grid item>
          <TextField
            label="Parent Label Name" value={this.state.inputParentLabelName} onChange={handleChildLabelNameChange}
            fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>,
        <Grid item>
          <TextField
            label="Child Label Name" value={this.state.inputChildLabelName} onChange={handleChildLabelNameChange}
            fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}} onClick={handleClickAddNewChildLabel}
            disabled={this.state.inputChildLabelName.length === 0}
            variant="contained" color="primary">
              Add Child
          </Button>
          <Button style={{margin: "0.1rem"}} variant="contained" color="primary"
            disabled={this.state.inputChildLabelName.length > 0}>
              Update
          </Button>
          <Button style={{margin: "0.1rem"}} variant="contained" color="secondary">
            Delete {this.state.selectedParentLabel.name}
          </Button>
        </Grid>
      ]
    } else {
      // None is selected
      gridItems = [
        <Grid item>
          <TextField
            label="Parent Label Name"
            value={this.state.inputParentLabelName}
            onChange={handleParentLabelNameChange}
            fullWidth
            InputLabelProps={{ shrink: true }} />
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}} onClick={handleClickAddParentLabel}
            variant="contained" color="primary">
            Add
          </Button>
        </Grid>
      ]
    }

    return (
      <Grid
        style={{ width: "30%", margin: "0.5rem" }}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        container
        spacing={1}>
        {gridItems}
      </Grid>
    )
  }

  render() {
    return (
      <Paper className="LabelManagement">
        <Typography variant="h5">Manage Labels</Typography>
        <Grid
          style={{ width: "100%", marginTop: "1rem" }}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          container
          spacing={1}>
          {this.panelParentLabels}
          <Divider orientation="vertical" flexItem />
          {this.panelChildLabels}
          <Divider orientation="vertical" flexItem />
          {this.panelEditLabel}
        </Grid>
      </Paper>
    )
  }
}