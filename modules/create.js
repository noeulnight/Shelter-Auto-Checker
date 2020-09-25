const fetch = require('node-fetch')

module.exports = async (email, passwd, tag, send, db) => {
  return new Promise( async resolve => {
    let body = { "email": email, "password": passwd, "returnSecureToken": true }
    let response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCzeBduftRqigBli1pZJlI3BAduXxCFCrg', { method: 'post', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    let json = await response.json()
    
    if (json.idToken) {
      let data = await db.select('*').where({email: email}).from('userdata')
      if (data[0]) return resolve('<script>alert("해당 로그인 정보는 이미 서버에 있습니다!");window.location.replace("/")</script>')
      db.insert({ email:email, password: passwd, tag: tag, token: json.idToken, send:send }).into('userdata').then((err) => {
        resolve('<script>alert("성공적으로 등록되었습니다! 내일 0시 0분을 기다려주세요!");window.location.replace("/")</script>')
      })
    } else return resolve('<script>alert("Shelter.id 로그인중 문제가 발생하였습니다. 이메일 또는 비밀번호를 다시 확인해주세요");window.location.replace("/")</script>')
  })
}