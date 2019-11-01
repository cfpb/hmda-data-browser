import React from 'react'
import Select from 'react-select'

import { categoryStyleFn } from './selectUtils.js'

const categories = [
  {value: 'states', label: 'State'},
  {value: 'counties', label: 'County'},
  {value: 'msamds', label: 'MSA/MD'},
  {value: 'nationwide', label: 'Nationwide'},
]

const CategorySelect = ({ onChange }) => {
  return (
    <Select
      controlShouldRenderValue={false}
      onChange={onChange}
      styles={categoryStyleFn}
      openOnFocus
      simpleValue
      options={categories}
    />
  )
}

export default CategorySelect
