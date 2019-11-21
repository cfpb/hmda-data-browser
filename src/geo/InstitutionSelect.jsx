import React from 'react'
import Select, { createFilter } from 'react-select'
import MenuList from './MenuList.jsx'
import Pills from './Pills.jsx'
import {
  categoryStyleFn,
  itemStyleFn,
  makeItemPlaceholder,
  makeItemSelectValues,
  pruneItemOptions
} from './selectUtils.js'

class InstitutionSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disableItems: props.items && props.items.length === 0
    }
  }

  onMethodChange = opt => {
    opt.value && this.props.onChange([])
    this.setState({ disableItems: opt.value })
  }

  render() {
    const { items, onChange, options, nationwide } = this.props
    const { disableItems } = this.state
    
    const category = 'leis'
    const selectedValues = makeItemSelectValues(category, items)
    const methodValue = !nationwide ? METHOD_SEL_OPTS[0] : METHOD_SEL_OPTS.filter(
      opt => opt.value === this.state.disableItems
    )[0]

    return (
      <>
        <h3>What financial institution would you like to select?</h3>
        <p>You can select one or more financial institutions by entering the financial institutions LEI or name. <br/>NOTE: Filtering by financial institution is currently only available when the geography filter is set to Nationwide.</p>
        <LeiMethodSelect 
          value={methodValue} 
          onChange={this.onMethodChange} 
          options={filterOpts(nationwide)}
        />
        <Select
          id='lei-item-select'
          components={{ MenuList }}
          filterOption={createFilter({ ignoreAccents: false })}
          controlShouldRenderValue={false}
          styles={itemStyleFn}
          onChange={onChange}
          placeholder={itemPlaceholder(disableItems, category, selectedValues)}
          isMulti={true}
          searchable={true}
          autoFocus
          openOnFocus
          simpleValue
          value={selectedValues}
          options={pruneItemOptions(category, options, selectedValues)}
          isDisabled={this.state.disableItems}
        />
        <Pills values={selectedValues} onChange={onChange} />
      </>
    )
  }
}

const LeiMethodSelect = ({ onChange, value, options }) => (
  <Select
    id='lei-method-select'
    onChange={onChange}
    styles={categoryStyleFn}
    openOnFocus
    simpleValue
    value={value}
    options={options}
  />
)

const METHOD_SEL_OPTS = [
  { value: true, label: 'All' },
  { value: false, label: 'Specific' }
]

function filterOpts(nationwide){
  if(nationwide) return METHOD_SEL_OPTS
  return [METHOD_SEL_OPTS[0]]
}

function itemPlaceholder(all, category, selectedValues) {
  if (all) return 'All institutions selected'
  return makeItemPlaceholder(category, selectedValues)
}

export default InstitutionSelect
