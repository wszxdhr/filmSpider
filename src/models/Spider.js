import superagent from 'superagent-charset'

export default function (url) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .charset('gbk')
      .end(function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
  })
}
