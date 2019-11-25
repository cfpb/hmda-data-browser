import React from 'react'
import Error from './Error.jsx'
import LoadingButton from './LoadingButton.jsx'

export const ActionsWarningsErrors = ({
  downloadCallback,
  downloadEnabled,
  showSummaryButton,
  summaryEnabled,
  loadingDetails,
  requestSubset,
  isLargeFile,
  error
}) => {
  return (
    <>
      <LoadingButton onClick={downloadCallback} disabled={!downloadEnabled}>
        Download Dataset
      </LoadingButton>
      {showSummaryButton && (
        <LoadingButton
          loading={loadingDetails}
          onClick={requestSubset}
          disabled={!summaryEnabled}
          secondary={true}
        >
          View Summary Table
        </LoadingButton>
      )}
      {isLargeFile ? (
        <div className='LargeFileWarning'>
          <h4>Warning:</h4> This dataset may be too large to be opened in
          standard spreadsheet applications
        </div>
      ) : null}
      {error ? <Error error={error} /> : null}
    </>
  )
}
