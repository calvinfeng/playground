import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component'
import TimelineElement from './TimelineElement'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import './App.scss';
import 'react-vertical-timeline-component/style.min.css'
import { VideoJSON, Orientation } from './types';

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

const videos: VideoJSON[] = [
  {
    year: 2020,
    month: "April",
    day: 9,
    youtube_url: "https://www.youtube.com/watch?v=ifYsuZX9sOQ",
    orientation: Orientation.Portrait,
    title: "Practice Recording - Back in Black Solo 75%",
    description: "I can play at 75%"
  },
  {
    year: 2020,
    month: "March",
    day: 6,
    youtube_url: "https://www.youtube.com/watch?v=Dogm9asWlRY",
    orientation: Orientation.Landscape,
    title: "Practice Record - Back in Black Jam Session",
    description: "I play with Steve"
  }
]

function App() {
  return (
    <div className="App">
      <p>You are running this application in {process.env.NODE_ENV}, with sever URL {process.env.REACT_APP_API_URL}</p>
      <VerticalTimeline animate={true}>
        <TimelineElement videos={videos} year={2020} month={"April"} />
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="March, 2020"
          contentArrowStyle={contentArrowStyle}
          contentStyle={contentStyle}
          iconStyle={iconStyle}
          icon={<MusicNoteIcon />}>
          <h3 className="vertical-timeline-element-title">Title</h3>
          <h4 className="vertical-timeline-element-subtitle">Subtitle</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac dolor quis massa
            rhoncus egestas. Morbi ornare, lectus nec tempor consequat, massa mi accumsan lacus, sed
            malesuada tellus urna at nunc. Sed pellentesque odio vitae leo pretium varius. Fusce
            vitae lectus quis libero pellentesque facilisis quis eu quam. Cras egestas fermentum
            velit, sed ultrices magna blandit at. Praesent justo tortor, ullamcorper et aliquam at,
            auctor et diam. Maecenas vitae massa quis libero porta euismod sit amet id mi. In rhoncus
            sapien eget orci rhoncus euismod.
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="February, 2020"
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          contentStyle={contentStyle}
          iconStyle={iconStyle}
          icon={<MusicNoteIcon />}>
          <h3 className="vertical-timeline-element-title">Title</h3>
          <h4 className="vertical-timeline-element-subtitle">Subtitle</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac dolor quis massa
            rhoncus egestas. Morbi ornare, lectus nec tempor consequat, massa mi accumsan lacus, sed
            malesuada tellus urna at nunc. Sed pellentesque odio vitae leo pretium varius. Fusce
            vitae lectus quis libero pellentesque facilisis quis eu quam. Cras egestas fermentum
            velit, sed ultrices magna blandit at. Praesent justo tortor, ullamcorper et aliquam at,
            auctor et diam. Maecenas vitae massa quis libero porta euismod sit amet id mi. In rhoncus
            sapien eget orci rhoncus euismod.
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default App;
