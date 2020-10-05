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
  selectedLabel: LogLabelJSON | null
  selectedSubLabel: LogLabelJSON | null
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
      selectedLabel: null,
      selectedSubLabel: null
    }
  }

  newHandlerSelectLabel = (label: LogLabelJSON | null) => () => {
    this.setState({
      selectedLabel: label
    })
  }

  newHandlerSelectSubLabel = (label: LogLabelJSON | null) => () => {
    this.setState({
      selectedSubLabel: label
    })
  }

  get panelParentLabels() {
    const items: JSX.Element[] = this.props.logLabels.filter((label: LogLabelJSON) => {
      return label.parent_id === nilUUID
    }).map((label: LogLabelJSON) => {
      let style = { margin: "0.1rem" }
      let handler = this.newHandlerSelectLabel(label)
      if (this.state.selectedLabel !== null && this.state.selectedLabel.id === label.id) {
        style["background"] = "green"
        handler = this.newHandlerSelectLabel(null)
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
      if (this.state.selectedLabel === null) {
        return false
      }
      return label.parent_id === this.state.selectedLabel.id
    }).map((label: LogLabelJSON) => {      
      let style = { margin: "0.1rem" }
      let handler = this.newHandlerSelectSubLabel(label)
      if (this.state.selectedLabel !== null && 
        this.state.selectedSubLabel !== null &&
        this.state.selectedSubLabel.id === label.id) {
        style["background"] = "green"
        handler = this.newHandlerSelectSubLabel(null)
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
    let gridItems: JSX.Element[]
    // 3 possible cases:
    //   - parent & child selected
    //   - parent selected
    //   - none selected
    if (this.state.selectedLabel !== null && this.state.selectedSubLabel !== null) {
      gridItems = [
        <Grid item>
        <Typography variant="subtitle1">
          Selected Sub Label: {this.state.selectedSubLabel.name}
        </Typography>
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}} variant="contained" color="secondary">Delete</Button>
        </Grid>
      ]
    } else if (this.state.selectedLabel !== null && this.state.selectedSubLabel === null) {
      gridItems = [
        <Grid item>
          <Typography variant="subtitle1">
            Selected Label: {this.state.selectedLabel.name}
          </Typography>
        </Grid>,
        <Grid item>
          <TextField
            label="New Sub Label Name"
            value={""}
            onChange={() => {}}
          fullWidth
          InputLabelProps={{ shrink: true }} />
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}} variant="contained" color="primary">Add Child</Button>
          <Button style={{margin: "0.1rem"}} variant="contained" color="secondary">Delete</Button>
        </Grid>
      ]
    } else {
      gridItems = [
        <Grid item>
          <TextField
            label="New Label Name"
            value={""}
            onChange={() => {}}
          fullWidth
          InputLabelProps={{ shrink: true }} />
        </Grid>,
        <Grid item>
          <Button style={{margin: "0.1rem"}}  variant="contained" color="primary">Add</Button>
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