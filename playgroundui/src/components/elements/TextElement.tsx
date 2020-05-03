import React from 'react'
import {
  VerticalTimelineElement
} from 'react-vertical-timeline-component'
import {
  Typography
} from '@material-ui/core'
import MusicNoteIcon from '@material-ui/icons/MusicNote'

import {
  contentStyle,
  contentArrowStyle,
  iconStyle
} from '../config'
import './TextElement.scss'

type Props = {
  date: string
  title: string
  subtitle: string
  paragraph: string
}

export default function TextElement(props: Props) {
  return <VerticalTimelineElement
    className="vertical-timeline-element-work"
    date={props.date}
    contentArrowStyle={contentArrowStyle}
    contentStyle={contentStyle}
    iconStyle={iconStyle}
    icon={<MusicNoteIcon />}>
    <Typography variant="h6">{props.title}</Typography>
    <Typography variant="subtitle1">{props.subtitle}</Typography>
    <Typography variant="body2">{props.paragraph}</Typography>
  </VerticalTimelineElement>
}