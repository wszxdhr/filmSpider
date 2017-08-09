import Spider from '../../models/Spider'
import {sleep, parseUrl} from '../../tool/Common'
import cheerio from 'cheerio'

export default {
  list: async function (url) {
    if (typeof url === 'object') {
      let result = []
      let pageList = []
      // 循环url
      for (let u of url) {
        await sleep(500)
        let html = await Spider(u)
        let $ = cheerio.load(html.text)
        let maxPage = 0
        let nextBtn = $('a')
        // 循环末页按钮得到页数
        for (let nx in nextBtn) {
          if (nextBtn[nx].attribs) {
            // console.log('nx = ', nx)
            // console.log(nextBtn[nx].text())
            if (nextBtn[nx].attribs.href) {
              if (nextBtn[nx].attribs.href.includes('list_') && nextBtn[nx].next.next.name === 'select') {
                let lastIndex = nextBtn[nx].attribs.href.lastIndexOf('_')
                let htmlIndex = nextBtn[nx].attribs.href.indexOf('.html')
                let currentPageHref = nextBtn[nx].attribs.href.substring(0, lastIndex)
                // console.log(currentPageHref)
                maxPage = nextBtn[nx].attribs.href.substring(lastIndex + 1, htmlIndex)
                pageList.push(maxPage)
                // 真正的开始
                for (let p = 1; p <= maxPage; p++) {
                  await sleep(500)
                  // console.log('spiding: ', u + currentPageHref + '_' + p + '.html')
                  let html = await Spider(u + currentPageHref + '_' + p + '.html')
                  let $n = cheerio.load(html.text)
                  let links = $n('a.ulink')
                  // console.log(parseUrl(u).host)
                  console.log('current URL: ', u + currentPageHref + '_' + p + '.html', 'page: ' + p + '/' + maxPage, 'length: ', result.length)
                  for (let a in links) {
                    if (links[a].attribs) {
                      if (links[a].attribs.href && !links[a].attribs.href.includes('index.html')) {
                        result.push(parseUrl(u).host + links[a].attribs.href)
                      }
                    }
                  }
                }
              }
            }
          }
        }
        console.log(pageList)
      }
      return result
    }
  },
  page: async function (url) {
    console.log('url length = ', url.length)
    let result = []
    for (let u of url) {
      await sleep(500)
      let html = await Spider(u)
      let body = html.text
      let $ = cheerio.load(body, {decodeEntities: true})
      // console.log($.html())
      let title = $('.bd3r .title_all h1 font').text()
      console.log(title)
      let dlLink = []
      $('#Zoom a').each(function () {
        let attr = $(this)
        if (attr[0].attribs.href.indexOf('ftp://') !== -1) {
          dlLink.push({link: attr[0].attribs.href, title})
        }
      })
      result = result.concat(dlLink)
      // console.info('bdr3 title_all')
      // console.log($('bdr3 title_all'))
    }
    return result
  }
}
