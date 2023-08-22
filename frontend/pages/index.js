import React from 'react'
import Tracking from './tracking/index'
import TrackLayout from '../layouts/TrackLayout'
const Home = () => {
  return <Tracking />
}

export default Home

Home.getLayout = (page) => <TrackLayout>{page}</TrackLayout>
