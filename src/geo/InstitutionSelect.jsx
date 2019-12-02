import React, { useEffect, useState } from 'react'
import Select, { createFilter } from 'react-select'
import MenuList from './MenuList.jsx'
import Pills from './Pills.jsx'
import {
  itemStyleFn,
  makeItemPlaceholder,
  makeItemSelectValues,
  // pruneItemOptions,
  // isNationwide,
  sortByLabel
} from './selectUtils.js'
import { runFetch, makeFilersUrl } from '../api.js'
import { isEqual } from 'lodash'

const InstitutionSelect = ({
  items,
  onChange,
  // options,
  geoCategory,
  geoItems
}) => {
  const [leis, setLeis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    runFetch(makeFilersUrl({ category: geoCategory, items: geoItems }))
      .then(data => {
        setLeis(data.institutions)
        setLoading(false)
      })
      .catch(error => console.log(error))
  }, [geoItems])

  useEffect(() => {
    if (!leis.length) return
    const validLeis = keepValidLeis(leis, items)
    if (!isEqual(items, validLeis)) onChange(validLeis.map(v => ({ value: v})))
  }, [items, leis])

  const category = 'leis'
  const selectedValues = makeItemSelectValues(category, items)

  return (
    <div className='SelectWrapper'>
      <h3>Step 2: Select Financial Institution (optional)</h3>
      <p>
        You can select one or more financial institutions by entering the
        financial institutions LEI or name. <br />
        <strong>
          NOTE: Only Institutions that operate in the selected geography are available for selection.
        </strong>
      </p>
      <Select
        id='lei-item-select'
        components={{ MenuList }}
        filterOption={createFilter({ ignoreAccents: false })}
        controlShouldRenderValue={false}
        styles={styleFn}
        onChange={onChange}
        placeholder={itemPlaceholder(loading, items.length, category, selectedValues)}
        isMulti={true}
        searchable={true}
        autoFocus
        openOnFocus
        simpleValue
        value={selectedValues}
        options={pruneLeiOptions(leis, selectedValues)}
        isDisabled={loading}
      />
      <Pills values={selectedValues} onChange={onChange} />
    </div>
  )
}

function keepValidLeis(valid, selected) {
  const leis = valid.map(v => v.lei)
  return selected.filter(s => leis.includes(s))
}

function pruneLeiOptions(data, selected) {
  let opts = data
    .filter(i => !selected.includes(i.lei))
    .map(i => ({ value: i.lei, label: `${i.name.toUpperCase()} - ${i.lei}` }))
    .sort(sortByLabel)
  opts.unshift({ value: 'all', label: `All Financial Institutions (${data.length})` })
  return opts
}

const styleFn = {
  ...itemStyleFn,
  container: p => ({ ...p, width: '100%' }),
  control: p => ({ ...p, borderRadius: '4px' })
}

function itemPlaceholder(loading, hasItems, category, selectedValues) {
  if(loading) return 'Loading...'
  if (!hasItems)
    return (
      'All institutions selected. ' +
      makeItemPlaceholder(category, selectedValues) +
      ' to filter'
    )
  return makeItemPlaceholder(category, selectedValues)
}

InstitutionSelect.defaultProps = {
  geoItems: []
}

export default InstitutionSelect
