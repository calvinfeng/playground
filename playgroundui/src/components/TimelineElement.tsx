import React from 'react'
import ReactPlayer from 'react-player'
import axios, { AxiosInstance, AxiosResponse }  from 'axios'
import { VerticalTimelineElement }  from 'react-vertical-timeline-component'
import { Popover, Button, Paper } from '@material-ui/core'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import { VideoJSON, Orientation } from './types'
import './TimelineElement.scss'
import { contentStyle, contentArrowStyle, iconStyle } from './config' 

type TimelineElementState = {
  videos: VideoJSON[]
}

type TimelineElementProps = {
  year: number
  month: number
}

class TimelineElement extends React.Component<TimelineElementProps, TimelineElementState> {
  private http: AxiosInstance

  constructor(props: TimelineElementProps) {
    super(props)
    this.state = {
      videos: [],
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidMount() {
    this.http.get('/api/recordings/practices/', {
      params: {
        year: this.props.year,
        month: this.props.month
      }
    }).then((resp: AxiosResponse) => {
      this.setState({
        videos: resp.data.results
      })
    })
  }

  render() {
    let date = `${this.props.year}`
    if (this.state.videos.length > 0) {
      date = `${this.state.videos[0].month}, ${this.props.year}`
    }
  
    return (
      <VerticalTimelineElement
        date={date}
        contentArrowStyle={contentArrowStyle}
        contentStyle={contentStyle}
        iconStyle={iconStyle}
        icon={<MusicNoteIcon />}>
        <div className='TimelineElement'>
          {this.state.videos.map((video: VideoJSON) => {
            return <VideoPopover video={video} />
          })}
        </div>
      </VerticalTimelineElement>
    )
  }
}

export default TimelineElement

type VideoPopoverProps = {
  video: VideoJSON
}

function VideoPopover(props: VideoPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  let width, height, className
  if (props.video.orientation === Orientation.Portrait) {
    height = 480;
    width = 270;
    className = 'paper portrait-mode'
  } else {
    height = 270;
    width = 480;
    className = 'paper landscape-mode'
  }

  return (
    <div className="VideoPopover">
      <Button variant="contained" color="primary" onClick={handleClick}>
        {props.video.title}
      </Button >
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Paper className={className}>
            <ReactPlayer 
              url={props.video.youtube_url}
              width={width}
              height={height}
              controls={true} />
          </Paper>
        </Popover>
    </div>
  )
}