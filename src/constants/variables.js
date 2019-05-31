const actions_taken = {
  label: 'Action Taken',
  options: [
    { id: '1', name: '1 - Loan Originated' },
    { id: '2', name: '2 - Application approved but not accepted' },
    { id: '3', name: '3 - Application denied' },
    { id: '4', name: '4 - Application withdrawn by applicant' },
    { id: '5', name: '5 - File closed for incompleteness' },
    { id: '6', name: '6 - Purchased loan' },
    { id: '7', name: '7 - Preapproval request denied' },
    { id: '8', name: '8 - Preapproval request approved but not accepted' }
  ],
  mapping: {
    1: '1 - Loan Originated',
    2: '2 - Application approved but not accepted',
    3: '3 - Application denied',
    4: '4 - Application withdrawn by applicant',
    5: '5 - File closed for incompleteness',
    6: '6 - Purchased loan',
    7: '7 - Preapproval request denied',
    8: '8 - Preapproval request approved but not accepted'
  }
}


const raceList = [
  'American Indian or Alaska Native',
  'Asian',
  'Black or African American',
  'Native Hawaiian or Other Pacific Islander',
  'White',
  '2 Or More Minority Races',
  'Joint',
  'Free Form Text Only',
  'Race Not Available'
]

const races = {
  label: 'Race',
  options: [],
  mapping: {}
}

raceList.forEach(name => {
  const id = encodeURIComponent(name)
  races.options.push({ id, name })
  races.mapping[name] = name
})

const sexes = {
  label: 'Sex',
  options: [
    {id: 'Male', name: 'Male'},
    {id: 'Female', name: 'Female'},
    {id: 'Joint', name: 'Joint'}
  ],
  mapping: {
    Male: 'Male',
    Female: 'Female',
    Joint: 'Joint'
  }
}

export default {
  actions_taken,
  races,
  sexes
}
