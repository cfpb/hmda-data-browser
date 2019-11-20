import { shallow } from 'enzyme'
import React from 'react'
import InstitutionSelect from './InstitutionSelect'

describe('InstitutionSelect', () => {
  it('is All by default and disables item input', () => {
    const changeSpy = jest.fn()
    const wrapper = shallow(
      <InstitutionSelect items={[]} onChange={changeSpy} options={[]} />
    )
    const itemSelect = wrapper.find('#lei-item-select')

    expect(itemSelect.prop('isDisabled')).toBe(true)
    expect(itemSelect.prop('placeholder')).toBe('All institutions selected')
  })

  it('enables item input for Specific', () => {
    const changeSpy = jest.fn()
    const wrapper = shallow(
      <InstitutionSelect items={[]} onChange={changeSpy} options={[]} />
    )
    wrapper.setState({ disableItems: false })
    const itemSelect = wrapper.find('#lei-item-select')

    expect(itemSelect.prop('isDisabled')).toBe(false)
    expect(itemSelect.prop('placeholder')).not.toBe('All institutions selected')
  })

  it('sets input method to Specific when given items', () => {
    const changeSpy = jest.fn()
    const wrapper = shallow(
      <InstitutionSelect
        items={[{ value: 'test', label: 'test' }]}
        onChange={changeSpy}
        options={{leis: []}}
      />
    )
    const itemSelect = wrapper.find('#lei-item-select')

    expect(itemSelect.prop('isDisabled')).toBe(false)
    expect(itemSelect.prop('placeholder')).not.toBe('All institutions selected')
  })
})
