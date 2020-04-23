import React from 'react'
import ReactPlayer from 'react-player'
import { VerticalTimelineElement }  from 'react-vertical-timeline-component'
import { Popover, Button, Paper } from '@material-ui/core'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import { VideoJSON, Orientation } from './types'
import './TimelineElement.scss'

const contentStyle = {
  background: 'rgb(255, 255, 255)',
  color: 'rgb(0, 0, 0)'
}
  
const contentArrowStyle = {
  borderRight: '7px solid  #1565c0'
}

const iconStyle = {
  background: '#1565c0',
  color: '#fff'
}

type TimelineElementProps = {
  year: number
  month: string
  videos: VideoJSON[]
}

export default function TimelineElement(props: TimelineElementProps) {

  return (
    <VerticalTimelineElement
      date={`${props.month}, ${props.year}`}
      contentArrowStyle={contentArrowStyle}
      contentStyle={contentStyle}
      iconStyle={iconStyle}
      icon={<MusicNoteIcon />}>
      <div className='TimelineElement'>
        {props.videos.map((video: VideoJSON) => {
          return <VideoPopover video={video} />
        })}
      </div>
    </VerticalTimelineElement>
  )
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