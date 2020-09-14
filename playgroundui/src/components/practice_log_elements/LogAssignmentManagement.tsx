import React from 'react'
import './LogAssignmentManagement.scss'
import {
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'

type Props = {}
type State = {
  inputFieldAssignmentName: string
}

export default class LogAssignmentManagement extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      inputFieldAssignmentName: ""
    }
  }

  handleAssignmentNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      inputFieldAssignmentName: ev.target.value
    })
  }

  handleNewAssignmentSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    console.log(this.state)
  }

  get assignmentInput() {
    return (
      <form
        className="assignment-input"
        id="assignment-form"
        onSubmit={this.handleNewAssignmentSubmit}>
        <TextField
          label="Add a new assignment to the list"
          value={this.state.inputFieldAssignmentName}
          onChange={this.handleAssignmentNameChange}
          fullWidth
          InputLabelProps={{ shrink: true }} />
        <Button
          style={{display: 'none'}}
          type="submit"
          form="assignment-form">
            Submit
        </Button>
      </form>
    )
  }

  render() {
    return (
      <Paper className="LogAssignmentManagement">
        <Typography variant="h5">Assignments</Typography>
        <List dense={false}>
          <ListItem>
            <ListItemText primary="Item 1" secondary={'Secondary text'} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Item 2" secondary={'Secondary text'} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        {this.assignmentInput}
      </Paper>
    )
  }
}