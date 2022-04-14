// const _ = require('lodash')
var seedrandom = require('seedrandom')
// const getOscilatron = require('./ocilação-de-tempo')

function round2(num) {
  return parseFloat(num.toFixed(2))
}

function calRange(min, max, percent) {
  return round2((max - min) * percent + min)
}

const ticketProduct = 19.9

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
    bad: ticketProduct * 1.6,
    good: ticketProduct * 0.4,
  },
  read: {
    bad: 0.6,
    good: 0.9,
  },
}

const funil = ['ctr', 'cpm', 'cpa', 'read']

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

function getScore(money = 0) {
  const result = Object.fromEntries(
    funil.map(f => [
      f,
      calRange(goodAndBad[f].bad, goodAndBad[f].good, Math.random()),
    ])
  )
  const views = (1000 / (result.cpm / money)) * (result.ctr / 100) // * result.read
  // console.log(views)
  result['vendas'] = views / result.cpa
  return result
}

const getAllMetrics = (idName, money) => {
  seedrandom(idName, { global: true })

  const metrics = Object.fromEntries(filters.map(f => [f, getScore(money)]))
  metrics['vendas'] = metrics
  // console.log(metrics2)
  // console.log(metrics)

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

function createConj({ conjName, nameAds }) {
  const P1 = getAllMetrics(conjName, 60) //'[A-FDF] recife; gosta de futebol', 60)

  const ads = nameAds.map(name => getAllMetrics(name, 20))
  // const A1 = getAllMetrics('[A-FDF] sem botão; cta agressivo', 20)
  // const A2 = getAllMetrics('[A-FDF] botão rosa; cta passivo', 20)
  // const A3 = getAllMetrics('[A-FDF] botão rosa; sem cta', 20)

  const newAds = ads.map((ad, id) => meanJoin([ad, P1], `Anuncio ${id}`))

  newAds.forEach(ad => {
    console.log(ad)
  })
  // const newA1 = meanJoin([A1, P1], 'Anuncio a')
  // const newA2 = meanJoin([A2, P1], 'Anuncio b')
  // const newA3 = meanJoin([A3, P1], 'Anuncio c')

  return meanJoin(newAds, 'Conjunto')
}

console.log(
  createConj({
    conjName: '[A-FDF] recife; gosta de futebol',
    nameAds: [
      '[A-FDF] sem botão; cta agressivo',
      '[A-FDF] botão rosa; cta passivo',
      '[A-FDF] botão rosa; sem cta',
    ],
  })
)
