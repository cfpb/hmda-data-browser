import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from './Header'
import Home from './Home'
import NotFound from './common/NotFound'
import Footer from './Footer'
import Geography from './geo/Geography.jsx'
import Beta from './Beta.jsx'

import './app.css'

const betaLinks = [
  { name: 'Home', href: '/' },
  { name: 'Data Browser', href: '/data-browser/' }
]

const App = () => {
  const isBeta = window.location.host.match('beta')
  const headerLinks =  isBeta ? betaLinks : null
  return (
    <>
      <Header pathname={window.location.pathname} links={headerLinks}/>
      {isBeta ? <Beta/> : null}
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
    </>
  )
}

export default App
