import React from 'react';
import {
  Card,
  CardHeader,
  CardMedia, 
  Grid,
  CardContent,
  Typography,
  Tooltip
} from '@material-ui/core'
import './GearGallery.scss'

export default function GearGallery() {
  const PRSCE24 = (
    <Grid container className="grid-row" direction="row" spacing={2} justify="center" >
      <Grid item>
        <Card className="portrait-card">
          <CardMedia
            component="img"
            image={process.env.PUBLIC_URL + '/img/ce_24_body_full.jpg'}
            className="media" />
            <CardHeader
              title="PRS CE 24 Semi-Hollow 2020"
              subheader="Vintage Sunburst, Maple Top, Mahogany Body with Bolt-on Maple Neck" />
        </Card>
      </Grid>
      <Grid item>
        <Card className="portrait-card">
          <CardMedia
            component="img"
            image={process.env.PUBLIC_URL + '/img/ce_24_body_1.jpg'}
            className="media" />
            <CardContent>
              <Typography>
                Writing in progress because it's the latest addition to my collection.
              </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
          <CardMedia
            component="img"
            image={process.env.PUBLIC_URL + '/img/ce_24_headstock.jpg'}
            className="media" />
          <CardContent>
            <Typography>
              Writing in progress...
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const FenderStrat = (
    <Grid container className="grid-row" direction="row" spacing={2} justify="center">
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/ultra_strat_body_full.jpg'}
              className="media" />
            <CardHeader
              title="Fender American Ultra Stratocaster 2020"
              subheader="Plasma Red Burst, Alder Body with Bolt-on Maple Neck" />              
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/ultra_strat_body_2.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                I eventually got my hands on a Fender Stratocaster with 3 single coil pickups in
                June 2020. This is the perfect instrument for producing lightly distorted or clean
                tone. Since it is a modern strat, it has a compound fretboard radius. I got to admit
                that this has much better ergonomic than Les Paul. The fretboard is round near the
                nut, which is suited for playing chords. The fretboard is flat near the bridge,
                which is suited for fast lead playing. 
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/ultra_strat_body_1.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                However, I haven't used it much for recordings because I have been mostly working on
                Hard Rock and Metal songs. I took it out couple times to jam with my friends but
                those videos are not available on here.
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
    </Grid>
  )

  const GibsonLP = (
    <Grid container className="grid-row" direction="row" spacing={2} justify="center">
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/les_paul_studio_body_full.jpg'}
              className="media" />
            <CardHeader
              title="Gibson Les Paul Studio 2019"
              subheader="Tangerine Burst, Maple Top, Mahogany Body with Set Mahogany Neck" />              
        </Card>
      </Grid>
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/les_paul_studio_body_1.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                This is my first "legitimate" electric guitar with amazing playability and beautiful
                humbucker tone.
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/les_paul_studio_bridge.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                I received it as a 28th birthday present from my girlfriend. I was trying to decide
                between a Les Paul and Stratocaster. The internet convinced me that eventually I
                need both for different music genre and play style. It became a question which one
                first? I think I am very much a Les Paul guy when it comes to Rock music.
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
    </Grid>
  )

  const IbanezRG421 = (
    <Grid container className="grid-row" direction="row" spacing={2} justify="center">
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/rg421_body_full.jpg'}
              className="media" />
            <CardHeader
              title="Ibanez RG421 2020"
              subheader="Blackberry Sunburst, Meranti Body with Bolt-on Maple Neck" />              
        </Card>
      </Grid>
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/rg421_body_1.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                I needed a faster guitar, i.e. guitar with a long slim neck and flat fingerboard
                radius for Hard Rock and Heavy Metal music.
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/rg421_bridge.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                I didn't want to spend too much money on a metal guitar because my skill level was
                nowhere near shredding stage. I still wanted to experiment and experience what it
                was like to play on an Ibanez that's geared toward modern metal players. I bought
                this from Amazon (again) for $299.99 in March 2020. This is a much better guitar
                than the Donner I bought in 2019. It didn't have the build quality of my Les Paul
                but it's been reliable and easily adjustable (truss rod, bridge saddles, etc...)
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
    </Grid>
  )

  const Donner = (
    <Grid container className="grid-row" direction="row" spacing={2} justify="center">
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/donner_body_full.jpg'}
              className="media" />
            <CardHeader
              title="Donner DST-1B 2019"
              subheader="Black, Basswood Body with Bolt-on Maple Neck" />              
        </Card>
      </Grid>
      <Grid item>
        <Card className="landscape-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/donner_body_2.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                I bought this guitar from Amazon for like $149.99 in June 2019. I heard the song
                Wonderful Tonight by Eric Clapton from my girlfriend's Spotify playlist. It was
                simple yet so beautiful. I wanted to try learing it on a guitar that resembles his.
                At the time, I wasn't fully committed to learning the instrument. However that
                kickstarted everything you see on this blog. The guitar was very unreliable. The
                jacks were loose, the output was weak, and the pickups broke down after 1 month of
                playing. I don't recommend this to any beginner.
               </Typography>
            </CardContent>             
        </Card>
      </Grid>
      <Grid item>
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/donner_body_3.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                However, I kept the guitar and fixed the pickups. It has special sentimental value to me now.
              </Typography>
            </CardContent>             
        </Card>
      </Grid>
    </Grid>
  )

  return (
    <div className="GearGallery">
      {PRSCE24}
      {FenderStrat}
      {IbanezRG421}
      {GibsonLP}
      {Donner}
    </div>
  )
}
