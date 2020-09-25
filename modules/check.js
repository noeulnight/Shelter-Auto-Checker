const fetch = require('node-fetch')

module.exports = async (db) => {
  let datas = await db.select('*').from('userdata')
  datas.forEach(async (data) => {
    let tags = data.tag.split(',')
    tags.forEach(async (item) => {
      let checksend
      data.send !== '' ? checksend = data.send : checksend = '와! 출첵!'
      let body = { "content": checksend, "image": "" }
      let response = await fetch('https://rest.shelter.id/v1.0/shelters/' + item + '/attendances', { method: 'post', body: JSON.stringify(body), headers: {'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*', 'Refere':'https://shelter.id/base', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36 Edg/85.0.564.51','Authorization': 'Bearer ' + data.token } })
      let json = await response.json()
      console.log('출석을 처리했습니다 : ' + data.email + ', ' + json.message)
    })
  })
}