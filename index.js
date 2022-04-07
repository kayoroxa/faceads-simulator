// const _ = require('lodash')
var seedrandom = require('seedrandom')

function round2(num) {
  return parseFloat(num.toFixed(2))
}

function calRange(min, max, percent) {
  return round2((max - min) * percent + min)
}

const goodAndBad = {
  ctr: {
    bad: 0.5,
    good: 2.5,
  },
  cpm: {
    bad: 30,
    good: 8,
  },
  cpa: {
    bad: 40,
    good: 5,
  },
}

const funil = ['ctr', 'cpm', 'cpa']

const filters = [
  'desktop',
  'android',
  'ios',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
  'feed-facebook',
  'feed-instagram',
  'reels',
  'stories',
]

function getScore() {
  return Object.fromEntries(
    funil.map(f => [
      f,
      calRange(goodAndBad[f].bad, goodAndBad[f].good, Math.random()),
    ])
  )
}

const getAllMetrics = idName => {
  seedrandom(idName, { global: true })

  const metrics = Object.fromEntries(filters.map(f => [f, getScore()]))
  // console.log(metrics2)
  console.log(metrics)

  const allToMean = Object.fromEntries(
    funil.map(f => [f, Object.values(metrics).map(item => item[f])])
  )

  return {
    idName,
    metrics,
    mean: Object.fromEntries(
      funil.map(f => [
        f,
        round2(allToMean[f].reduce((a, b) => a + b, 0) / allToMean[f].length),
      ])
    ),
  }
}

function mean(data) {
  return Object.fromEntries(
    Object.keys(data[0]).map(f => [
      f,
      round2(data.reduce((a, b) => a + b[f], 0) / data.length),
    ])
  )
}

function meanJoin(ads, idName) {
  const metrics = Object.fromEntries(
    filters.map(f => [f, mean([...ads.map(ad => ad.metrics[f])])])
  )

  const allToMean = Object.fromEntries(
    funil.map(f => [f, Object.values(metrics).map(item => item[f])])
  )

  return {
    idName,
    metrics,
    mean: Object.fromEntries(
      funil.map(f => [
        f,
        round2(allToMean[f].reduce((a, b) => a + b, 0) / allToMean[f].length),
      ])
    ),
  }
}

const P1 = getAllMetrics('[A-FDF] recife; gosta de futebol')

const A1 = getAllMetrics('[A-FDF] sem botão; cta agressivo')
const A2 = getAllMetrics('[A-FDF] botão rosa; cta passivo')
const A3 = getAllMetrics('[A-FDF] botão rosa; sem cta')

const newA1 = meanJoin([A1, P1], 'Anuncio a')
const newA2 = meanJoin([A2, P1], 'Anuncio b')
const newA3 = meanJoin([A3, P1], 'Anuncio c')

// console.log(A1)
console.log(newA1)

// console.log(A2)
console.log(newA2)

console.log(newA3)

console.log(meanJoin([newA1, newA2, newA3], 'Conjunto 1'))
