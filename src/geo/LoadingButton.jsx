import React from 'react'
import LoadingIcon from '../common/LoadingIcon.jsx'

const LoadingButton = ({loading, disabled, onClick, children, secondary}) => {
  return (
    <>
      <button onClick={onClick} disabled={disabled} className={makeClassname({disabled, secondary})}>
        {children}
      </button>
      {loading ? <LoadingIcon className="LoadingInline" /> : null}
    </>
  )
}

function makeClassname(opts={}){
  let cname = 'QueryButton'
  if(opts.disabled) cname += ' disabled'
  if(opts.secondary) cname += ' secondary'

  return cname
}

export default LoadingButton
