import React from 'react';
import {
  BrowserRouter,
  Route,
  Link
} from "react-router-dom";
import { MenuRounded } from '@material-ui/icons'
import {
  Typography,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton
} from '@material-ui/core'
import Timeline from './Timeline'
import './App.scss';

function App() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  const handleMenuOnClose = (ev: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null)
    setMenuOpen(false)
  }

  const handleMenuOnClick = (ev: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(ev.currentTarget as HTMLElement)
    setMenuOpen(true)
  }

  return (
    <div className="App">
      <AppBar position="static" color="default" className="app-bar">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" onClick={handleMenuOnClick}>
            <MenuRounded />
          </IconButton>
          <Menu 
            open={menuOpen}
            onClose={handleMenuOnClose} 
            getContentAnchorEl={null}
            anchorEl={anchorEl}
            anchorOrigin={{"vertical": "bottom", "horizontal": "center"}} >
            <MenuItem onClick={() => {}} disabled={false} >
              Example
            </MenuItem>
          </Menu>
          <Typography color="inherit" variant="h6" className="title">Calvin Feng</Typography>
        </Toolbar>
      </AppBar>
      <p>You are running this application in {process.env.NODE_ENV}, with sever URL {process.env.REACT_APP_API_URL}</p>
      <BrowserRouter>
        <Route path="/" exact component={Timeline} />
        <Route path="/about" exact component={EmptyDiv} />
      </BrowserRouter>
    </div>
  );
}

function EmptyDiv() {
  return <div>Hello</div>
}

export default App;
