function makeGeography(){

}

function makeVariables(){

}

function makeOptions(){

}

function makeParam(s, key) {
  if(s[key]) return `${key}=${stringify(s[key])}`
}

function stringify(v) {
}

export function makeSearchFromState(s){
  console.log('state', s)
  const params = [
    makeParam(s, 'states'),
    makeParam(s, 'states'),
    makeParam(s, 'states'),
    makeParam(s, 'states'),
  ]
   const s = `?
    states=${state.states}
    ${makeVariables(obj.variableOrder)}
    ${makeOptions(obj.variables)}
  `
  if(s.length === 1) return ''
}

//qwe.gov/yo?states=TX,CA&msamds=10234&var1=a,b&var2=c,d
//qwe.gov/yo?geography=TX~10130&variables=abc,def&options=var1~a,b!var2~c,d
export function makeQuerystring(obj){
  const s = `?
    ${makeGeography(obj.state, obj.msaMd)}
    ${makeVariables(obj.variableOrder)}
    ${makeOptions(obj.variables)}
  `
  if(s.length === 1) return ''
}

export function parseQuerystring(search){
  const obj = {}

  search.slice(1).split('&').forEach(v => {
    const spl = v.split('=')
    obj[spl[0]] = spl[1]
  })

  return obj
}
