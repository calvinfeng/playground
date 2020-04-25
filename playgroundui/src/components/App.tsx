import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component'
import TimelineElement from './TimelineElement'
import ProgressReport from './ProgressReport'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core'
import './App.scss';
import 'react-vertical-timeline-component/style.min.css'

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
function App() {  
  const intro = (
    <Card className="text-card">
      <CardMedia image={process.env.PUBLIC_URL + '/img/acoustic-guitar.jpg'} title="Random Guitar" className="media" />
      <CardContent className="content">
        <Typography variant="h4">Guitar Journey</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph={true}>
          A documentary of my learning progress from a beginner to intermediate player
        </Typography>
        <Typography variant="body2" paragraph={true}>
          I was first exposed to guitar when I was around 16. As a teenager, I was lacking the
          discipline to stay focused and practice rigoriously. I took guitar lessons for a year.
          I didn't really pay much attention to music theory or maintain a practice routine. Perhaps
          this is one of those things I wish I could have done better. It was the middle of 2019,
          I discovered Justin Sandercoe's online guitar course. The lessons are so well
          structured, it motivated me to pick up guitar seriously once again.
        </Typography>
        <Typography variant="body2" paragraph={true}>
          Ever since August, 2019 I've been practicing with a rigorious schedule. I practiced
          strictly at least one hour a day. I wanted to see how far can discipline get me. I
          decided to document my guitar playing. Every month I make a progress report
          video. The idea of a progress report is to track the development of my techique. I use
          songs as a metric to test my skill level. If I am improving over time, the songs I play
          will increase in complexity and difficulty. In between each progress report, there are
          monthly uploads where I doucment the work I do before each progress report.
        </Typography>
      </CardContent>
    </Card>
  )

  // Given that videos update rate is pretty slow, I will just hard code the year and month values.
  return (
    <div className="App">
      <p>You are running this application in {process.env.NODE_ENV}, with sever URL {process.env.REACT_APP_API_URL}</p>
      {intro}
      <VerticalTimeline animate={true}>
        <TimelineElement year={2020} month={4} />
        <ProgressReport index={5} date={"March, 2019"} />
        <TimelineElement year={2020} month={3} />
        <ProgressReport index={4} date={"February, 2019"} />
        <TimelineElement year={2020} month={2} />
        <ProgressReport index={3} date={"January, 2020"} />
        <TimelineElement year={2020} month={1} />
        <ProgressReport index={2} date={"December, 2019"} />
        <TimelineElement year={2019} month={12} />
        <ProgressReport index={1} date={"November, 2019"} />
        <TimelineElement year={2019} month={11} />
        <ProgressReport index={0} date={"October, 2019"} />
        <TimelineElement year={2019} month={10} />
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="September, 2019"
          contentArrowStyle={contentArrowStyle}
          contentStyle={contentStyle}
          iconStyle={iconStyle}
          icon={<MusicNoteIcon />}>
          <h3 className="vertical-timeline-element-title">The Journey Begins</h3>
          <h4 className="vertical-timeline-element-subtitle">Ling Ling 40 Hours</h4>
          <p>
            What is Ling Ling? Quoted Wikipedia, "In 2017, TwoSet Violin made a comedic reference to
            Ling Ling, a fictional violinist who "practices 40 hours a day", and has attained
            ultimate musical proficiency." Talent is overrated in most human endeavors. I want to
            put my discipline and commitment to test. From this point on, I will practice everyday.
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default App;
