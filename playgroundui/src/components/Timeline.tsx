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

import PracticeRecordingElement from './elements/PracticeRecordingElement'
import ProgressReportElement from './elements/ProgressReportElement'
import TextElement from './elements/TextElement'
import './Timeline.scss'

type Props = {}

export default function Timeline(props: Props) {
  // Given that videos update rate is pretty slow, I will just hard code the year and month values.
  return <div className="Timeline">
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
          decided to document my guitar playing. Every month I upload progress report
          video and practice recordings. The idea of a progress report is to track the development
          of my techique. I use songs as a metric to test my skill level. If I am improving over
          time, the songs I play will increase in fluidity, complexity and difficulty.
        </Typography>
      </CardContent>
    </Card>
    <VerticalTimeline animate={true}>
      <ProgressReportElement index={6} date={"April, 2019"} />
      <PracticeRecordingElement
        year={2020}
        month={4}
        title={"Back in Black Solo"}
        paragraph={`For this month, majority of my effort is to learn the Angus Young's solo in Back
          in Black. This is particularly challenging to me because it's the fastest solo I've ever
          attended to learn. The progress was painfully slow but was extremely rewarding and
          beneficial to my development. In my relax time, I played a bit of Beyond's solo. It helped
          me to stay sane.
        `} />
      <ProgressReportElement index={5} date={"March, 2019"} />
      <PracticeRecordingElement
        year={2020}
        month={3}
        title={"Back in Black Rhythm & Yesterday"}
        paragraph={`I worked with Steve to learn the Back in Black's groove. It's a tricky song
          because my guitar part generally strums on the off beats. The chord voicing wasn't difficult
          but it required me to palm mute on all the power chords. The riff that involves moving my
          left hand quickly also took some efforts to pick up. In my spare time, I picked up Beatles'
          Yesterday because it's a simple yet beautiful tune.`} />
      <ProgressReportElement index={4} date={"February, 2019"} />
      <PracticeRecordingElement
        year={2020}
        month={2}
        title={"New Condenser Microphone"}
        paragraph={`I got my AT2020 and became obsessed with singing. I made multiple recordings for my
          favorite songs and improved upon previously recorded 21 Guns sound tracks. Near the end of the
          month, Fetchers decided to put together a music group. Steve and I started working on Back in
          Black.`} />
      <ProgressReportElement index={3} date={"January, 2020"} />
      <PracticeRecordingElement
        year={2020}
        month={1}
        title={"New Recording Technique"}
        paragraph={`I bought an audio interface and Bias FX for simulated software amplification.
          This allowed me to record my practices with greater details, easier to spot mistakes. Steve
          and I also completed a full recording of 21 Guns.`} />
      <ProgressReportElement index={2} date={"December, 2019"} />
      <PracticeRecordingElement
        year={2019}
        month={12}
        title={"Christmas"}
        paragraph={`The biggest news was that I got a Les Paul. I've been working on Blues lesson
          from Justin Guitar. I continued with my regular practice routines, i.e. scales, barre chords,
          improvisation, and chord changes.`} />
      <ProgressReportElement index={1} date={"November, 2019"} />
      <PracticeRecordingElement
        year={2019}
        month={11} 
        title={"Fetch Band"}
        paragraph={`In actual realiy, it's just Steve and me. We started to jam together. It's actually
          a very lucky thing for a guitarist to play with a drummer. In most cases, guitarists struggle
          to find a drummer/percussionist. We played couple songs together and decided to focus on 21 Guns
          first because it's a beginner friendly song, mostly power chords and only 1 note that
          requires bending. `} />
      <ProgressReportElement index={0} date={"October, 2019"} />
      <PracticeRecordingElement
        year={2019}
        month={10}
        title={"First Month"}
        paragraph={`This was my first month of recording myself. I worked on couple important bucket
        list item song, Wonderful Tonight, Now & Forever, and Perfect. Wonderful Tonight has a
        beautiful lick that gives me an early glimpse into string bending technique. Now & Forever is
        technically challenging to me on acoustic because all I ever learned was strumming basic
        chords.`} />
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