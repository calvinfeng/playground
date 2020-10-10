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
import PracticeLog from './PracticeLog'
import PracticeTimeProgress from './widgets/PracticeTimeProgress'
import './App.scss'
import { GoogleUserProfile } from './types';

const clientID = "819013443672-rt8eomsr25jmkfej2odksjihsboduo6a.apps.googleusercontent.com"

function App() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<GoogleUserProfile | null>(null);

  const handleMenuOnClose = (ev: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null)
    setMenuOpen(false)
  }

  const handleMenuOnClick = (ev: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(ev.currentTarget as HTMLElement)
    setMenuOpen(true)
  }

  // TODO: Store the ID token in cache
  // As soon as page is loaded, check the token and send it to backend to verify that token is
  // still valid and return profile information.
  const handleGoogleResponse = (resp: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ((resp as GoogleLoginResponseOffline).code) {
      resp = resp as GoogleLoginResponseOffline
    } else {
      resp = resp as GoogleLoginResponse
      const userProfile: GoogleUserProfile = {
        token_id: resp.tokenId,
        access_token: resp.accessToken,
        granted_scopes: resp.getGrantedScopes(),
        google_user_id: resp.getBasicProfile().getId(),
        google_email: resp.getBasicProfile().getEmail(),
        full_name: resp.getBasicProfile().getName(),
        given_name: resp.getBasicProfile().getGivenName(),
        family_name: resp.getBasicProfile().getFamilyName(),
        image_url: resp.getBasicProfile().getImageUrl()
      }
      setUser(userProfile)
      console.log(userProfile)
      // It seems to me that Google user only has scopes for 
      // [email,
      //  profile,
      //  https://www.googleapis.com/auth/userinfo.profile,
      //  https://www.googleapis.com/auth/userinfo.email,
      //  openid]
    }
  }

  const environmentIndicator = (
    <p>
      You are running this application in {process.env.NODE_ENV}, 
      with sever URL {process.env.REACT_APP_API_URL}
    </p>
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
              <PracticeLogMenuItem />
              <AboutMenuItem />
              <FretboardMenuItem />
            </Menu>
            <Typography color="inherit" variant="h6" className="title">Calvin Feng</Typography>
          </Toolbar>
        </section>
        <section className="right-container">
          <Toolbar>
            <GoogleLogin
              disabled={process.env.NODE_ENV !== "development"}
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
        <Route path="/practicelog" exact component={PracticeLog} />
        <Route path="/about" exact component={About} />
        <Route path="/fretboard" exact component={Fretboard} />
      </Switch>
      </BrowserRouter>
    </div>
  );
}

enum Path {
  Timeline = "/",
  About = "/about",
  Fretboard = "/fretboard",
  PracticeLog = "/practicelog"
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

function PracticeLogMenuItem() {
  const history = useHistory()
  const location = useLocation()

  function handleClick() {
    history.push(Path.PracticeLog);
  }

  return (
    <MenuItem onClick={handleClick} disabled={location.pathname === Path.PracticeLog}>
      Practice Log
    </MenuItem>
  );
}

export default App;
