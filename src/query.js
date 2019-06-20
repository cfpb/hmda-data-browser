import MSAS from './constants/msaToName.js'
import STATES from './constants/stateObj.js'
import VARIABLES from './constants/variables.js'

const msaKeys = Object.keys(MSAS)
const stateKeys = Object.keys(STATES)
const varKeys = Object.keys(VARIABLES)

function makeParam(s, key) {
  if(key === 'variables'){
    const vars = s[key]
    return s.variableOrder.map(v =>{
      return `${v}=${Object.keys(vars[v]).join(',')}`
    }).join('&')
  }
  if(key === 'details'){
    return Object.keys(s[key]).length ? 'getDetails=1' : ''
  }
  return stringifyIfTruthy(s, key)
}

function stringifyIfTruthy(s, key) {
  const v = s[key]
  if(Array.isArray(v))
    return v.length ? formatParam(key, v.join(',')) : ''
  return v ? formatParam(key, v.toString()) : ''
}

function formatParam(k,v){
  return `${k}=${v}`
}

function isInvalidKey(key, s){
  const sKeys = Object.keys(s)
  if( sKeys.indexOf(key) !== -1 ||
      varKeys.indexOf(key) !== -1 ||
      key === 'getDetails') {
    return false
  }

  return true
}

function sanitizeArray(key, val) {
  const arr = []
  let knownKeys

  if(key === 'msamds') knownKeys = msaKeys
  else if(key === 'states') knownKeys = stateKeys
  else knownKeys = Object.keys(VARIABLES[key].mapping)

  val.forEach(v => {
    if(knownKeys.indexOf(v) !== -1) arr.push(v)
  })

  return arr
}

export function makeStateFromSearch(search, s, detailsCb, updateSearch){
  const qsParts = search.slice(1).split('&')
  let regenerateSearch = false

  qsParts.forEach(part => {
    if(!part) return

    let [key, val] = part.split('=')
    val = val.split(',')

    if(isInvalidKey(key, s)) {
      regenerateSearch = true
      return
    }

    if(key === 'nationwide') s[key] = true
    else if(['states', 'msamds'].indexOf(key) !== -1){
      const sanitized = sanitizeArray(key, val)
      if(sanitized.length !== val.length) regenerateSearch = true
      s[key] = sanitized
    }
    else if(key === 'getDetails') setTimeout(detailsCb, 0)
    else {
      s.variableOrder.push(key)
      const sanitized = sanitizeArray(key, val)
      if(sanitized.length !== val.length) regenerateSearch = true
      sanitized.forEach(v => {
        if(s.variables[key]) s.variables[key][v] = true
        else if(v) s.variables[key] = {[v]: true}
        else s.variables[key] = {}
      })
    }
  })

  //update search based on failed validation
  if(regenerateSearch) setTimeout(updateSearch, 0)

  return s
}

export function makeSearchFromState(s){
  let params = [
    makeParam(s, 'states'),
    makeParam(s, 'msamds'),
    makeParam(s, 'nationwide'),
    makeParam(s, 'variables'),
    makeParam(s, 'details')
  ]

  params = params.filter(v => v)
  const str = `?${params.join('&')}`

  if(str.length === 1) return ''

  return str
}

export function parseQuerystring(search){
  const obj = {}

  search.slice(1).split('&').forEach(v => {
    const spl = v.split('=')
    obj[spl[0]] = spl[1]
  })

  return obj
}
