import React from 'react'
import './LabelManagement.scss'
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

type State = {
  selectedLabel: LogLabelJSON | null
}

type Props = {
  logLabels: LogLabelJSON[] 
}

export default class LabelManagement extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedLabel: null
    }
  }

  newHandlerSelectLabel = (label: LogLabelJSON | null) => () => {
    this.setState({
      selectedLabel: label
    })
  }

  get panelParentLabels() {
    const items: JSX.Element[] = this.props.logLabels.filter((label: LogLabelJSON) => {
      return label.parent_id === null
    }).map((label: LogLabelJSON) => {
      let chip: JSX.Element
      if (this.state.selectedLabel !== null && this.state.selectedLabel.id === label.id) {
        chip = (
          <Chip
            style={{ margin: "0.1rem", background: "green" }}
            label={label.name}
            icon={<MusicNote />}
            deleteIcon={<DoneIcon />}
            onDelete={this.newHandlerSelectLabel(null)}
            color="primary" />
        )
      } else {
        chip = (
          <Chip
            onClick={this.newHandlerSelectLabel(label)}
            style={{ margin: "0.1rem" }}
            label={label.name}
            icon={<MusicNote />}
            color="primary" />
        )
      }
      return (
        <Grid item>
          {chip}
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
      return label.parent_id !== null
    }).map((label: LogLabelJSON) => {
      let chip: JSX.Element
      if (this.state.selectedLabel !== null && this.state.selectedLabel.id === label.id) {
        chip = (
          <Chip
            style={{ margin: "0.1rem", background: "green" }}
            label={label.name}
            icon={<MusicNote />}
            deleteIcon={<DoneIcon />}
            onDelete={this.newHandlerSelectLabel(null)}
            color="primary" />
        )
      } else {
        chip = (
          <Chip
            onClick={this.newHandlerSelectLabel(label)}
            style={{ margin: "0.1rem" }}
            label={label.name}
            icon={<MusicNote />}
            color="primary" />
        )
      }

      return (
        <Grid item>
          {chip}
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
    const items: JSX.Element[] = [
      <Typography>Seleced Label</Typography>,
      <TextField
        label="Label Name"
        value={""}
        onChange={() => {}}
        fullWidth
        InputLabelProps={{ shrink: true }} />,
      <Button variant="contained">Add</Button>,
      <Button variant="contained">Delete</Button>
    ]

    return (
      <Grid
        style={{ width: "30%", margin: "0.5rem" }}
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        container
        spacing={1}>
        {items}
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