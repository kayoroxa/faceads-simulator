const _ = require('lodash')

function getOscilatron(views, { minOscilatron = 0.1, maxOscilatron = 1 }) {
  const viewsEstabilation = 1000

  const result =
    ((viewsEstabilation - views) / viewsEstabilation) *
      (maxOscilatron - minOscilatron) +
    minOscilatron

  const distance = Math.max(result, 0.1) * media
  return {
    distance,
    calculate: media => _.random(media - distance, media + distance),
  }
}
module.exports = getOscilatron

// const media = 100

// let views = 0
// console.log(
//   getOscilatron(media, views, { minOscilatron: 0.1, maxOscilatron: 1 })
// )
