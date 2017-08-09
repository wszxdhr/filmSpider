export default {
  'dytt8.net': {
    host: 'http://www.dytt8.net',
    target: {
      element: 'a',
      find: function (ele) {
        let reg = /(^(ftp:\/\/))|(\.mkv$)|(\.mp4$)|(\.rmvb$)|(\.avi$)/
        if (reg.test(ele.text)) {
          if (ele.attribs.hasOwnProperty('thunderhref')) {
            return ele.attribs.thunderhref
          } else {
            return ele.text
          }
        }
      }
    }
  }
}
