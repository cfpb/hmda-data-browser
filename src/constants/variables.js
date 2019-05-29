const actions_taken = {
  label: 'Action Taken',
  options: [
    { id: '1', name: 'Loan Originated' },
    { id: '2', name: 'Application approved but not accepted' },
    { id: '3', name: 'Application denied' },
    { id: '4', name: 'Application withdrawn by applicant' },
    { id: '5', name: 'File closed for incompleteness' },
    { id: '6', name: 'Purchased loan' },
    { id: '7', name: 'Preapproval request denied' },
    { id: '8', name: 'Preapproval request approved but not accepted' }
  ]
}


const raceList = [
  'American Indian or Alaska Native',
  'Asian',
  'Black Or African American',
  'Native Hawaiian Or Other Pacific Islander',
  'White',
  '2 or more minority races',
  'Joint',
  'Free Form Text Only',
  'Race Not Available'
]

const races = {
  label: 'Race',
  options: raceList.map(race => {
    return {
      id: encodeURIComponent(race),
      name: race
    }
  })
}

const sexes = {
  label: 'Sex',
  options: [
    {id: 'Male', name: 'Male'},
    {id: 'Female', name: 'Female'},
    {id: 'Joint', name: 'Joint'}
  ]
}

export default {
  actions_taken,
  races,
  sexes
}
