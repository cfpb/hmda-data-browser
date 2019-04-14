import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './Header'
import Home from './Home'
import NotFound from './common/NotFound'
import Footer from './Footer'
import Subsets from './Subsets'

import './app.css'

const App = () => {
  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
    {/*
        <Route path="/all-data/:year?" component={Subsets} />
        */}
        <Route
          path="/subsets/:year?"
          component={Subsets}
        />
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
