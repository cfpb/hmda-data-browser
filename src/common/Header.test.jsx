import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header.jsx'

it('renders the Header with type 1', () => {
  const r = shallow(<Header type={1}/>)
  expect(r.find('h1').length).toBe(1)
})

it('renders the Header with provided heading text', () => {
  const r = shallow(<Header type={2} headingText="abc"/>)
  expect(r.find('h2').text()).toBe('abc')
})

it('renders the Header with provided paragraph text', () => {
  const r = shallow(<Header type={3} paragraphText="123"/>)
  expect(r.find('p').text()).toBe('123')
  expect(r.find('.font-lead').length).toBe(0)
})

it('renders the Header with provided paragraph text as lead', () => {
  const r = shallow(<Header type={1} paragraphText="123"/>)
  expect(r.find('p').text()).toBe('123')
  expect(r.find('.font-lead').length).toBe(1)
})

it('renders the Header with link', () => {
  const r = shallow(<Header type={3} headingText="alink" headingLink="/argle"/>)
  expect(r.find('Link[to="/argle"]')).toBeTruthy()
})

it('renders the disabled Header', () => {
  const r = shallow(<Header type={1} disabled={true}/>)
  expect(r.find('.disabled').length).toBe(1)
})
