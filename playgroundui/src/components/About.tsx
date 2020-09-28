import React from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {
  Card,
  CardHeader,
  CardMedia, 
  Grid,
  CardContent,
  Typography,
  Tooltip
} from '@material-ui/core'
import './About.scss'
import ReactPlayer from 'react-player';

enum Equations {
  BlochEqn = "\\psi(\\vec{r}) = u(r)e^{i k \\cdot \\vec{r}}",
  LondonEqn1 = "\\frac{\\partial j_{s}}{\\partial t} = \\frac{n_{s} e^{2}}{m} E",
  LondonEqn2 = "\\nabla \\times j_{s} = -\\frac{n_{s}e^{2}}{m} B"
}

export default function About() {
  const bio = (
    <section className="bio">
      <Card className="card">
        <CardMedia image={process.env.PUBLIC_URL + '/img/snowy.jpg'} title="Staring Screen" className="media" />
        <CardContent className="content">
          <Typography variant="h4">
            Introduction
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            I am currently a Senior Software Engineer at Fetch Robotics
          </Typography>
          <Typography variant="body2">
            I primarily work on the backend of fetchcore at Fetch Robotics. My work involves
            fleet management system, distributed robotic orchestration, real-time data streaming,
            and big data collection from robots running in the wild. It sounds fancy but it is not
            an overstatement. We have robotics engineers working on the individual intelligence of
            robot. I work on the collective intelligence of robots and provide data-driven solutions.
          </Typography>
        </CardContent>
      </Card>
    </section>
  )

  const quote1 = (
    <section className="quote">
      <Typography variant="caption">Simplicity is prerequisite for reliability</Typography>
    </section>
  )

  const quote2 = (
    <section className="quote">
      <Typography variant="caption">
        The art of programming is the art of organizing complexity, of mastering multitude and
        avoiding its bastard chaos as effectively as possible.
      </Typography>
    </section>
  )

  const quote3 = (
    <section className="quote">
      <Typography variant="caption">
        The purpose of life, as far as I can tell… is to find a mode of being that’s so meaningful
        that the fact that life is suffering is no longer relevant.
      </Typography>
    </section>
  )
  const background = (
    <section className="background">
      <Card className="card">
        <CardContent className="text-content">
          <Typography variant="h4">
            Background
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Solid State Physics - Superconductivity
          </Typography>
          <Typography variant="body2">
            I studied physics with a specialization in computational physics. My research interest
            was in solid-state physics. I was studying how and why do materials go superconducting,
            i.e its electrical resistance drops to zero after reaching a critical temperature with
            Jorge Hirsch, the dude who invented H-index. My background heavily influenced my interests
            in programming. It was my first experience of writing a software to solve a real world
            problem.
          </Typography>
        </CardContent>
        <CardContent className="math">
            <TeX math={Equations.BlochEqn} className="eqn" />
            <TeX math={Equations.LondonEqn1} className="eqn" />
            <TeX math={Equations.LondonEqn2} className="eqn" />
        </CardContent>
      </Card>
    </section>
  )

  const meisnerDemo = (
    <section className="meissner-demo">
      <Card className="card">
        <CardContent>
          <ReactPlayer 
            url={'https://www.youtube.com/watch?v=Bia4vV4CS5o'}
            width={480}
            height={270}
            controls={true} />
        </CardContent>
      </Card>
    </section>
  )
  
  const guitarShopping = (
    <Card className="medium-card">
      <CardHeader
        title="Outside of Work"
        subheader="I enjoy shopping for guitars besides playing them." />
      <CardMedia
        image={process.env.PUBLIC_URL + '/img/guitarshop.png'}
        title="At Guitar Center"
        className="media" />
    </Card>
  )
  
  const mountainDriving = (
    <Card className="medium-card">
      <CardHeader
        title="Outside of Work"
        subheader="I enjoy driving with my friends on the weekends." />
      <Tooltip title="They are not in the picture. But trust me, they were there.">
        <CardMedia
          image={process.env.PUBLIC_URL + '/img/boxster.jpg'}
          title="Mountain Driving"
          className="media" />
      </Tooltip>
    </Card>
  )

  const guitarPlaying = (
    <Card className="medium-card">
    <CardHeader
      title="Outside of Work"
      subheader="It should be obvious now that I enjoy playing them" />
    <CardMedia
      image={process.env.PUBLIC_URL + '/img/playing.jpg'}
      title="Playing Guitar"
      className="media" />
    </Card>
  )

  const activities = (
    <section className="activities">
      <Grid container className="column" direction="column">
        <Grid container className="row" direction="row" spacing={1} justify="center" >
          <Grid item>{guitarShopping}</Grid>
          {/* <Grid item>{guitarPlaying}</Grid> */}
          <Grid item>{mountainDriving}</Grid>
        </Grid>
      </Grid>
    </section>
  )

  return (
    <div className="About">
      {bio}
      {quote1}
      {background}
      {meisnerDemo}
      {quote2}
      {activities}
      {quote3}
    </div>
  )
}
