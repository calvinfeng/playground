import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core'
import {
  VerticalTimeline,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'

import PracticeRecordingElement from './timeline_elements/PracticeRecordingElement'
import ProgressReportElement from './timeline_elements/ProgressReportElement'
import TextElement from './timeline_elements/TextElement'
import './Timeline.scss'

type Props = {}

export default function Timeline(props: Props) {
  // Given that videos update rate is pretty slow, I will just hard code the year and month values.
  return <div className="Timeline">
    <Card className="text-card">
      <CardMedia image={process.env.PUBLIC_URL + '/img/acoustic-guitar.jpg'}
        title="Random Guitar"
        className="media" />
      <CardContent className="content">
        <Typography variant="h4">Guitar Journey</Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph={true}>
          A documentary of my learning progress from a beginner to intermediate player
        </Typography>
        <Typography variant="body2" paragraph={true}>
          I was first exposed to guitar when I was around 16. As a teenager, I was lacking the
          discipline to stay focused and practice rigoriously. I took guitar lessons for a year.
          I didn't really pay much attention to music theory or maintain a practice routine. Perhaps
          this is one of those things I wish I could have done better. It was in the middle of 2019,
          I discovered Justin Sandercoe's online guitar course. The lessons were so well
          structured, it motivated me to pick up guitar seriously once again. And I figured, if I
          were to have a wedding any time soon, it is the best time now to pick up my guitar and
          form a band with my friends so we can perform on weddng day!
        </Typography>
        <Typography variant="body2" paragraph={true}>
          Ever since August, 2019 I've been practicing with a rigorious schedule. I practiced
          strictly at least one hour a day. I wanted to see how far can discipline get me. I
          decided to document my guitar playing. Every month I upload progress report
          video and practice recordings. The idea of a progress report is to track the development
          of my techique. I use songs as a metric to test my skill level. If I am improving over
          time, the songs I play will increase in fluidity, complexity and difficulty.
        </Typography>
      </CardContent>
    </Card>
    <VerticalTimeline animate={true}>
      <ProgressReportElement id={11} />
      <PracticeRecordingElement year={2020} month={8} />
      <ProgressReportElement id={10} />
      <PracticeRecordingElement year={2020} month={7} />
      <ProgressReportElement id={9} />
      <PracticeRecordingElement year={2020} month={6} />
      <ProgressReportElement id={8} />
      <PracticeRecordingElement year={2020} month={5} />
      <ProgressReportElement id={7} />
      <PracticeRecordingElement year={2020} month={4} />
      <ProgressReportElement id={6} />
      <PracticeRecordingElement year={2020} month={3} />
      <PracticeRecordingElement year={2020} month={2} />
      <ProgressReportElement id={5} />
      <PracticeRecordingElement year={2020} month={1} />
      <ProgressReportElement id={4} />
      <PracticeRecordingElement year={2019} month={12} />
      <ProgressReportElement id={3} />
      <ProgressReportElement id={2} />
      <PracticeRecordingElement year={2019} month={11} />
      <ProgressReportElement id={1} />
      <PracticeRecordingElement year={2019} month={10} />
      <TextElement
        date="September, 2019"
        title={"The Journey Begins"}
        subtitle={"Ling Ling 40 Hours"}
        paragraph={`What is Ling Ling? Quoted Wikipedia, "In 2017, TwoSet Violin made a comedic
          reference to Ling Ling, a fictional violinist who "practices 40 hours a day", and has
          attained ultimate musical proficiency." Talent is overrated in most human endeavors. I
          want to put my discipline and commitment to test. From this point on, I will practice
          everyday.`} />
    </VerticalTimeline>
  </div>
}