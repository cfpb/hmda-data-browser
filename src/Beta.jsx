import React from 'react'
import Alert from './common/Alert.jsx'

const Beta = props => {
  return (
    <div className="Beta">
      <Alert
        heading={'Data Browser Beta'}
        type="warning"
      >
        <p>
          Welcome to the beta version of the HMDA Data Browser.
          Data included is for testing purposes only.
          To view a financial institution's 2018 HMDA data, visit the
          {' '}<a href="https://ffiec.cfpb.gov/data-browser/">live version of the Data Browser</a>.
          {' '}For questions/suggestions, contact hmdahelp@cfpb.gov.
        </p>
      </Alert>
    </div>
  )
}

export default Beta
