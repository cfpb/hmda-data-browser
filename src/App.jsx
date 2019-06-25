import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './Header'
import Home from './Home'
import NotFound from './common/NotFound'
import Footer from './Footer'
import Geography from './geo/Geography.jsx'

import './app.css'

const App = () => {
  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/data/:year?" component={Geography} />
    {/*
        <Route
          path="/maps-graphs/:year?"
          component={MapsGraphs}
        />
      */}
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </React.Fragment>
  )
}

export default App
