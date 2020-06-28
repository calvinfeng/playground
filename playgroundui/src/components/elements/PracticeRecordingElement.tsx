import React from 'react'
import { VerticalTimelineElement }  from 'react-vertical-timeline-component'
import ReactPlayer from 'react-player'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import axios, { AxiosInstance, AxiosResponse }  from 'axios'
import {
  Popover,
  Paper,
  ButtonBase,
  Tooltip,
  Typography
} from '@material-ui/core'

import { VideoJSON, Orientation, MonthlySummaryJSON } from '../types'
import { contentStyle, contentArrowStyle, iconStyle } from '../config' 
import './PracticeRecordingElement.scss'

type State = {
  videos: VideoJSON[]
  summary: MonthlySummaryJSON | null
}

type Props = {
  year: number
  month: number
}

export default class PracticeRecordingElement extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props: Props) {
    super(props)
    this.state = {
      videos: [],
      summary: null 
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidMount() {
    this.http.get('/api/practice/recordings/', {
      params: {
        year: this.props.year,
        month: this.props.month
      }
    }).then((resp: AxiosResponse) => {
      this.setState({
        videos: resp.data.results
      })
    })

    this.http.get('/api/summaries/', {
      params: {
        year: this.props.year,
        month: this.props.month
      }
    }).then((resp: AxiosResponse) => {
      if (resp.data.results.length > 0) {
        this.setState({
          summary: resp.data.results[0]
        })
      }
    })
  }

  render() {
    let date = `${this.props.year}`
    if (this.state.videos.length > 0) {
      date = `${this.state.videos[0].month}, ${this.props.year}`
    }
  
    let textContainer = (
      <div className="text-container"></div>
    )
    
    if (this.state.summary !== null) {
      textContainer = (
        <div className="text-container">
          <Typography variant="h6">{this.state.summary.title}</Typography>
          <Typography variant="subtitle1">{this.state.summary.subtitle}</Typography>
          <Typography variant="body2">{this.state.summary.body}</Typography>
        </div>
      )
    }

    return (
      <VerticalTimelineElement
        date={date}
        contentArrowStyle={contentArrowStyle}
        contentStyle={contentStyle}
        iconStyle={iconStyle}
        icon={<MusicNoteIcon />}>
        <div
          className='PracticeRecordingElement'
          id={`practice-recording-element-${this.props.year}-${this.props.month}`}>
          <div className="video-thumbnail-container">
            {this.state.videos.map((video: VideoJSON) => {
              return <VideoPopover video={video} />
            })}
          </div>
          {textContainer}
        </div>
      </VerticalTimelineElement>
    )
  }
}

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

  // const oldButton = (
  //   <Button variant="contained" color="primary" onClick={handleClick}>
  //     {props.video.title}
  //   </Button >
  // )

  return (
    <div className="VideoPopover" id={`video-popover-${props.video.youtube_video_id}`}>
      <Tooltip title={props.video.title}>
        <ButtonBase onClick={handleClick} id={`video-popover-button-${props.video.youtube_video_id}`}>
        <img
          alt="youtube-video-thumbnail"
          src={`https://img.youtube.com/vi/${props.video.youtube_video_id}/1.jpg`} />
        </ButtonBase>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Paper className={className}>
          <ReactPlayer 
            url={`https://www.youtube.com/watch?v=${props.video.youtube_video_id}`}
            width={width}
            height={height}
            controls={true} />
        </Paper>
      </Popover>
    </div>
  )
}