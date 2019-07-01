const actionsList = [
  { id: '1', name: 'Loan Originated' },
  { id: '2', name: 'Application approved but not accepted' },
  { id: '3', name: 'Application denied' },
  { id: '4', name: 'Application withdrawn by applicant' },
  { id: '5', name: 'File closed for incompleteness' },
  { id: '6', name: 'Purchased loan' },
  { id: '7', name: 'Preapproval request denied' },
  { id: '8', name: 'Preapproval request approved but not accepted' }
]

const loanTypeList = [
  { id: '1', name: 'Conventional' },
  { id: '2', name: 'FHA' },
  { id: '3', name: 'VA' },
  { id: '4', name: 'USDA' }
]

const loanPurposeList = [
  { id: '1', name: 'Home Purchase' },
  { id: '2', name: 'Home Improvement' },
  { id: '31', name: 'Refinancing' },
  { id: '32', name: 'Cash Out Refinancing' },
  { id: '4', name: 'Other Purpose' },
  { id: '5', name: 'Not Applicable' }
]

const lienStatusList = [
  { id: '1', name: 'Secured By First Lien' },
  { id: '2', name: 'Secured By Subordinate Lien' }
]

const constructionMethodList = [
  { id: '1', name: 'Site Built' },
  { id: '2', name: 'Manufactured Home' }
]

const sexList = [
  { id: '1', name: 'Male'},
  { id: '2', name: 'Female'},
  { id: '3', name: 'Joint'}
]

const raceList = [
  { id: '1', name: 'American Indian or Alaska Native'},
  { id: '2', name: 'Asian'},
  { id: '3', name: 'Black or African American'},
  { id: '4', name: 'Native Hawaiian or Other Pacific Islander'},
  { id: '5', name: 'White'},
  { id: '6', name: '2 Or More Minority Races'},
  { id: '7', name: 'Joint'},
  { id: '8', name: 'Free Form Text Only'},
  { id: '9', name: 'Race Not Available'}
]

const ethnicityList = [
  { id: '1', name: 'Hispanic or Latino'},
  { id: '2', name: 'Not Hispanic or Latino'},
  { id: '3', name: 'Joint'},
  { id: '4', name: 'Ethnicity Not Available'},
  { id: '5', name: 'Free Form Text Only'}
]

const totalUnitList = [
  { id: '1', name: '1'},
  { id: '2', name: '2'},
  { id: '3', name: '3'},
  { id: '4', name: '4'},
  { id: '5', name: '5-24'},
  { id: '6', name: '25-49'},
  { id: '7', name: '50-99'},
  { id: '8', name: '100-149'},
  { id: '9', name: '>149'}
]

const dwellingCategoryList = [
  { id: '1', name: 'Single Family (1-4 Units):Site-Built'},
  { id: '2', name: 'Multifamily:Site-Built'},
  { id: '3', name: 'Single Family (1-4 Units):Manufactured'},
  { id: '4', name: 'Multifamily:Manufactured'}
]

const loanProductList = [
  { id: '1', name: 'Conventional:First Lien' },
  { id: '2', name: 'FHA:First Lien' },
  { id: '3', name: 'VA:First Lien' },
  { id: '4', name: 'FSA/RHS:First Lien' },
  { id: '5', name: 'FHA:Subordinate Lien' },
  { id: '6', name: 'VA:Subordinate Lien' },
  { id: '7', name: 'FSA/RHS:Subordinate Lien' }
]

const actions_taken = buildWithId('Action Taken', actionsList)
const loan_types = buildWithId('Loan Type', loanTypeList)
const loan_purposes = buildWithId('Loan Purpose', loanPurposeList)
const lien_statuses = buildWithId('Lien Status', lienStatusList)
const construction_methods = buildWithId('Construction Method', constructionMethodList)

const sexes = buildWithId('Sex', sexList)
const races = buildWithId('Race', raceList)
const ethnicities = buildWithId('Ethnicities', ethnicityList)
const total_units = buildWithId('Total Units', totalUnitList)
const dwelling_categories = buildWithId('Dwelling Categories', dwellingCategoryList)
const loan_products = buildWithId('Loan Products', loanProductList)

function makeObj(label) {
  return {
    label,
    options: [],
    mapping: {}
  }
}

function buildWithId(label, list) {
  const obj = makeObj(label)

  list.forEach(o => {
    const nameWithId = `${o.id} - ${o.name}`
    obj.options.push({id: o.id, name: nameWithId})
    obj.mapping[o.id] = nameWithId
  })

  return obj
}

function buildEncoded(label, list) {
  const obj = makeObj(label)

  list.forEach(name => {
    const id = encodeURIComponent(name)
    obj.options.push({ id, name })
    obj.mapping[name] = name
  })

  return obj
}


export default {
  actions_taken,
  races,
  sexes,
  loan_types,
  loan_purposes,
  lien_statuses,
  construction_methods,
  ethnicities,
  total_units,
  dwelling_categories,
  loan_products
}
