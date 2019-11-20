import React from 'react'
import Select, { createFilter } from 'react-select'
import MenuList from './MenuList.jsx'
import CategorySelect from './CategorySelect.jsx'
import InstitutionSelect from './InstitutionSelect'
import Pills from './Pills.jsx'
import LoadingButton from './LoadingButton.jsx'
import { isNationwide } from './selectUtils'
import {
  pruneItemOptions,
  makeItemSelectValues,
  makeItemPlaceholder,
  itemStyleFn
} from './selectUtils.js'


const ItemSelect = ({
  options,
  category,
  onCategoryChange,
  items,
  isLargeFile,
  enabled,
  downloadCallback,
  onChange,
  leis,
  onInstitutionChange
}) => {
  const selectedValues = makeItemSelectValues(category, items)
  const nationwide = isNationwide(category)

  return (
    <div className='SelectWrapper'>
      <h3>What geography filter would you like to select?</h3>
      <p>
        Start by selecting a geography filter using the dropdown menu
        below.&nbsp;
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://ffiec.cfpb.gov/documentation/2018/data-browser-filters/#Nationwide'
        >
          View more information on the available filters.
        </a>
      </p>
      <CategorySelect category={category} onChange={onCategoryChange} />
      <Select
        components={{ MenuList }}
        filterOption={createFilter({ ignoreAccents: false })}
        controlShouldRenderValue={false}
        styles={itemStyleFn}
        onChange={onChange}
        placeholder={makeItemPlaceholder(category, selectedValues)}
        isMulti={true}
        searchable={true}
        isDisabled={nationwide}
        autoFocus
        openOnFocus
        simpleValue
        value={selectedValues}
        options={pruneItemOptions(category, options, selectedValues)}
      />
      {nationwide ? null : (
        <Pills values={selectedValues} onChange={onChange} />
      )}
      <InstitutionSelect
        items={leis}
        onChange={onInstitutionChange}
        options={options}
        nationwide={nationwide}
      />
      <LoadingButton onClick={downloadCallback} disabled={!enabled}>
        Download Dataset
      </LoadingButton>
      {isLargeFile ? (
        <div className='LargeFileWarning'>
          <h4>Warning:</h4> This dataset may be too large to be opened in
          standard spreadsheet applications
        </div>
      ) : null}
    </div>
  )
}

export default ItemSelect
