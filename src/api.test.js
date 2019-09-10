import React from 'react'
import {
  addVariableParams,
  addYears,
  createGeographyQuerystring,
  makeUrl,
  runFetch,
  makeCSVName,
  getSubsetDetails,
  getCSV,
  getGeographyCSV,
  getSubsetCSV
} from './api.js'

it('adds variable params from an object', () => {
  expect(addVariableParams({variables: {a: {1:123}, b: {2:223}}})).toBe('&a=1&b=2')
})

it('returns empty string on bad object', () => {
  expect(addVariableParams({})).toBe('')
})

it('adds years to an empty url', () => {
  expect(addYears()).toBe('?years=2018')
})

it('adds years to an existing qs', () => {
  expect(addYears('cool.com/a?b=c')).toBe('&years=2018')
})

it('creates a geography qs with both states and msamds', () => {
  const qs=createGeographyQuerystring({states: ['a','b'], msamds: ['c']})
  expect(qs).toBe('?states=a,b&msamds=c')
})

it('creates a geography qs with states only', () => {
  const qs=createGeographyQuerystring({states: ['a','b'], msamds: []})
  expect(qs).toBe('?states=a,b')
})

it('creates an empty geography qs', () => {
  const qs=createGeographyQuerystring()
  expect(qs).toBe('?')
})
