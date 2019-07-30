import React from 'react'
import Alert from './common/Alert.jsx'

const Beta = props => {
  const isBeta = window.location.host.match('beta')
  if(isBeta){
    return (
      <div className="Beta">
        <Alert
          heading={'Data Browser Beta'}
          type="warning"
        >
          <p>
            Welcome to the beta version of the HMDA Data Browser.
            All included data is artificial and has been generated for testing purposes only.
            For questions/suggestions, contact hmdafeedback@cfpb.gov.
          </p>
        </Alert>
      </div>
    )
  }
  return null
}

export default Beta
