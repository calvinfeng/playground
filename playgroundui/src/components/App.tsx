import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  useLocation,
  useHistory
} from "react-router-dom"
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
import About from './About'
import Fretboard from './Fretboard'
import PracticeTimeProgress from './widgets/PracticeTimeProgress'
import './App.scss'

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

  const environmentIndicator = (
    <p>You are running this application in {process.env.NODE_ENV}, with sever URL {process.env.REACT_APP_API_URL}</p>
  )

  return (
    <div className="App">
      <BrowserRouter>
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
            <TimelineMenuItem />
            <AboutMenuItem />
            {/* <FretboardMenuItem /> */}
          </Menu>
          <Typography color="inherit" variant="h6" className="title">Calvin Feng</Typography>
        </Toolbar>
      </AppBar>
      <PracticeTimeProgress />
      <Switch>
        <Route path="/" exact component={Timeline} />
        <Route path="/about" exact component={About} />
        {/* <Route path="/fretboard" exact component={Fretboard} /> */}
      </Switch>
      </BrowserRouter>
    </div>
  );
}

enum Path {
  Timeline = "/",
  About = "/about",
  Fretboard = "/fretboard",
}

function TimelineMenuItem() {
  const history = useHistory()
  const location = useLocation()

  function handleClick() {
    history.push(Path.Timeline);
  }

  return (
    <MenuItem onClick={handleClick} disabled={location.pathname === Path.Timeline}>
      Home
    </MenuItem>
  );
}

function AboutMenuItem() {
  const history = useHistory()
  const location = useLocation()

  function handleClick() {
    history.push(Path.About);
  }

  return (
    <MenuItem onClick={handleClick} disabled={location.pathname === Path.About}>
      About
    </MenuItem>
  );
}

function FretboardMenuItem() {
  const history = useHistory()
  const location = useLocation()

  function handleClick() {
    history.push(Path.Fretboard);
  }

  return (
    <MenuItem onClick={handleClick} disabled={location.pathname === Path.Fretboard}>
      Fretboard
    </MenuItem>
  );
}

export default App;
