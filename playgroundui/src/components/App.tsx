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
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import Timeline from './Timeline'
import About from './About'
import Fretboard from './Fretboard'
import PracticeTimeProgress from './widgets/PracticeTimeProgress'
import './App.scss'

const clientID = "819013443672-rt8eomsr25jmkfej2odksjihsboduo6a.apps.googleusercontent.com"

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

  const handleGoogleResponse = (resp: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ((resp as GoogleLoginResponseOffline).code) {
      resp = resp as GoogleLoginResponseOffline
    } else {
      resp = resp as GoogleLoginResponse
      console.log('token ID', resp.tokenId)
      console.log('user profile', resp.getBasicProfile())
      console.log('access token', resp.accessToken)
      console.log('scopes', resp.getGrantedScopes())
      // It seems to me that Google user only has scopes for 
      // [email,
      //  profile,
      //  https://www.googleapis.com/auth/userinfo.profile,
      //  https://www.googleapis.com/auth/userinfo.email,
      //  openid]
    }
  }

  const environmentIndicator = (
    <p>You are running this application in {process.env.NODE_ENV}, with sever URL {process.env.REACT_APP_API_URL}</p>
  )

  return (
    <div className="App">
      <BrowserRouter>
      <AppBar position="static" color="default" className="app-bar">
        <section className="left-container">
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
        </section>
        <section className="right-container">
          <Toolbar>
            <GoogleLogin
              disabled={true}
              clientId={clientID}
              buttonText={"Login with Google"}
              onSuccess={handleGoogleResponse}
              onFailure={handleGoogleResponse} />
          </Toolbar>
        </section>
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
