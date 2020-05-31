import React from 'react'
import axios, { AxiosInstance, AxiosResponse }  from 'axios'
import { LinearProgress, Tooltip } from '@material-ui/core'
import './PracticeTimeProgress.scss'

type State = {
  hours: number,
  minutes: number
}

type Props = {}

export default class PracticeTimeProgress extends React.Component<Props, State> {
  private http: AxiosInstance

  constructor(props: Props) {
    super(props)
    this.state = {
      hours: 0,
      minutes: 0
    }
    this.http = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      timeout: 1000,
      headers: {'Authorization': 'Bearer 1234'}
    });
  }

  componentDidMount() {
    this.http.get('/api/practicetime/').then((resp: AxiosResponse) => {
      this.setState({
        hours: resp.data.total_hours,
        minutes: resp.data.total_minutes
      })
    })
  }

  render() {
    const val = this.state.hours / 500
    return (
      <div className="PracticeTimeProgress">
        <Tooltip title={`${this.state.hours} / 500 hours on deliberate practice for 2020`}>
          <LinearProgress variant="determinate" value={val*100} />
        </Tooltip>
      </div>
    )
  }
}