const fetch = require('node-fetch')

module.exports = async (db) => {
  let datas = await db.select('*').from('userdata')
  await datas.forEach(async (data) => {
    let body = { "email": data.email, "password": data.password, "returnSecureToken": true }
    let response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCzeBduftRqigBli1pZJlI3BAduXxCFCrg', { method: 'post', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    let json = await response.json()
    await db.update({ token: json.idToken }).where({email : data.email}).from('userdata').then(console.log('토큰 리셋을 처리했습니다 : ' + data.email))
  })
}
