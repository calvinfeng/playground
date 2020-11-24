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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat. Sed a neque lacus.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
              convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
              Aliquam erat volutpat. Sed a neque lacus. Integer justo sem, sollicitudin at
              interdum non, finibus vitae neque. Nulla sagittis vestibulum nisi, sed scelerisque
              sem molestie vitae. Nunc dignissim mollis tellus, ut hendrerit ipsum vulputate vel.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat. Sed a neque lacus. Integer justo sem, sollicitudin at
                interdum non, finibus vitae neque. Nulla sagittis vestibulum nisi, sed scelerisque
                sem molestie vitae. Nunc dignissim mollis tellus, ut hendrerit ipsum vulputate vel.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat. Sed a neque lacus. Integer justo sem, sollicitudin at
                interdum non, finibus vitae neque. Nulla sagittis vestibulum nisi, sed scelerisque
                sem molestie vitae. Nunc dignissim mollis tellus, ut hendrerit ipsum vulputate vel.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat.
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat. Sed a neque lacus. Integer justo sem, sollicitudin at
                interdum non, finibus vitae neque. Nulla sagittis vestibulum nisi, sed scelerisque
                sem molestie vitae. Nunc dignissim mollis tellus, ut hendrerit ipsum vulputate vel.
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
        <Card className="portrait-card">
            <CardMedia
              component="img"
              image={process.env.PUBLIC_URL + '/img/donner_body_3.jpg'}
              className="media" />
            <CardContent>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat.
              </Typography>
            </CardContent>             
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                convallis non nunc nec luctus. Nam at vulputate lorem, quis porttitor felis.
                Aliquam erat volutpat. Sed a neque lacus. Integer justo sem, sollicitudin at
                interdum non, finibus vitae neque. Nulla sagittis vestibulum nisi, sed scelerisque
                sem molestie vitae. Nunc dignissim mollis tellus, ut hendrerit ipsum vulputate vel.
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
