import { runFetch, makeFilersUrl } from '../api.js'
import { isEqual } from 'lodash'

export function keepValidLeis(valid, selected) {
  const leis = valid.map(v => v.lei)
  return selected.filter(s => leis.includes(s))
}

export function countRecords(selected, counts) {
  if (!selected) return 0
  return selected.reduce((acc, selectOpt) => acc + counts[selectOpt.value], 0)
}

export function filterLeis() {
  if (this.state.leiDetails.leis.length) {
    const validLeis = keepValidLeis(this.state.leiDetails.leis, this.state.leis)
    if (!isEqual(this.state.leis, validLeis)) {
      const selected = validLeis.map(v => ({ value: v }))
      const count = countRecords(selected, this.state.leiDetails.counts)
      this.onInstitutionChange(selected, count)
    }
  }
}

export function fetchLeis() {
  const { category, items } = this.state
  this.setState(state => ({
    leiDetails: { ...state.leiDetails, loading: true }
  }))
  runFetch(makeFilersUrl({ category, items }))
    .then(data => {
      const newCounts = {}
      data.institutions.forEach(i => (newCounts[i.lei] = i.count))
      this.setState({
        leiDetails: {
          loading: false,
          leis: data.institutions,
          counts: newCounts
        }
      })
    })
    .catch(error => {
      return this.setStateAndRoute({error})
    })
}
