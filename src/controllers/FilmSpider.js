import sequelize from '../lib/sequelize'
import Sequelize from 'sequelize'
// import Spider from '../models/Spider'
import dytt8 from './Spiders/dytt8'
// import {HovercUnique} from '../tool/Common'

module.exports = async function () {
  let pending = sequelize.define('resolve', {
    link: Sequelize.STRING(1024),
    title: Sequelize.TEXT
  })
  let spiders = {
    dytt8
  }
  // 待完成队列
  // let pending = {}
  // 源URL
  let source = {
    // dytt8.net
    'dytt8': [
      'http://www.ygdy8.net/html/tv/hytv/',
      'http://www.ygdy8.net/html/gndy/dyzz/',
      'http://www.ygdy8.net/html/gndy/china/',
      'http://www.ygdy8.net/html/gndy/oumei/',
      'http://www.ygdy8.net/html/tv/rihantv/',
      'http://www.ygdy8.net/html/tv/oumeitv/',
      'www.ygdy8.net/html/dongman/'
    ]
  }
  // 已完成队列
  let resolved = []
  // let baseUrl = 'http://www.dytt8.net'
  for (let s in source) {
    // let index = source.indexOf(s)
    let pend = await spiders[s].list(source[s])
    // pending[s] = pending[s] ? pending[s] : []
    // pending[s].concat(pend)
    console.log(pend.length)
    resolved = resolved.concat(await spiders[s].page(pend))
  }

  sequelize.sync().then(() => pending.bulkCreate(resolved)).then(jane => {
    console.log(jane)
  })
}
