import React from 'react'
import ReactPlayer from 'react-player'
import axios, { AxiosInstance, AxiosResponse }  from 'axios'
import { VideoJSON } from './types'
import { VerticalTimelineElement }  from 'react-vertical-timeline-component'
import { contentStyle, contentArrowStyle, iconStyle } from './config' 
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import './ProgressReport.scss'

type Props = {
  index: number
  date: string
}

type State = {
  video: VideoJSON | null
}

export default class ProgressReport extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props: Props) {
    super(props)
    this.state = {
      video: null
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidMount() {
    // TODO: Implement query on server side
    this.http.get('/api/recordings/progress_reports/').then((resp: AxiosResponse) => {
      if (resp.data.results.length > 0 && resp.data.results.length > this.props.index) {
        // Invert it
        const i = resp.data.results.length - this.props.index - 1
        this.setState({
          video: resp.data.results[i]
        })
      }
    })
  }

  get content() {
    if (this.state.video === null) {
      return <div></div>
    }

    return (
      <div className="ProgressReport">
        <ReactPlayer 
          url={`https://www.youtube.com/watch?v=${this.state.video.youtube_video_id}`}
          width={"100%"}
          height={270}
          controls={true} />
      </div>
    )
  }

  render() {
    return (
      <VerticalTimelineElement
        date={this.props.date}
        contentArrowStyle={contentArrowStyle}
        contentStyle={contentStyle}
        iconStyle={iconStyle}
        icon={<MusicNoteIcon />}>
      <h3 className="vertical-timeline-element-title">Monthly Progress Recording</h3>
      {this.content}
      </VerticalTimelineElement>
    )
  }
}