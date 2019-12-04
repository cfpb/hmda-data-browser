import {pruneLeiOptions, itemPlaceholder} from './InstitutionSelect'

describe('pruneLeiOptions', () => {
  it('includes an all option', () => {
    expect(pruneLeiOptions([], [])[0].value).toBe('all')
  })
  it('prunes already selected options', () => {
    const leis = [{lei: 1, name: '1'}, {lei: 2, name: '2'}]
    const selected = [{value: 1, label: '1'}]
    const expected = [{"label": "All Financial Institutions (2)", "value": "all"}, {"label": "2 - 2", "value": 2}]
    expect(pruneLeiOptions(leis, selected)).toEqual(expected)
  })
})

describe('itemPlaceholder', () => {
  it('shows Loading... when loading', () => {
    const loading = true
    expect(itemPlaceholder(loading, null, null, null)).toContain('Loading');
  })
  it('shows All institutions selected when no LEIs selected', () => {
    const hasLeis = false
    expect(itemPlaceholder(false, hasLeis, 'leis', [])).toContain('All institutions selected.')
  })
  it('prompts for additional if at least some LEIs selected', () => {
    const hasLeis = true
    const selected = [1]
    expect(itemPlaceholder(false, hasLeis, 'leis', selected)).toContain('Select or type additional')
  })
})
