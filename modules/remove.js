const fetch = require('node-fetch')

module.exports = async (email, passwd, db) => {
  return new Promise( async resolve => {
    let data = await db.select('*').where({email: email}).from('userdata')
    if (!data[0]) return resolve('<script>alert("해당 이메일은 존재하지 않습니다!");window.location.replace("/")</script>')
    if (data[0].password === passwd) {
      db.delete().where({email : email}).from('userdata').then(resolve('<script>alert("성공적으로 삭제되었습니다! 다시 돌아와 주실꺼죠..?");window.location.replace("/")</script>'))
    } else {
      resolve('<script>alert("비밀번호가 일치하지 않습니다!");window.location.replace("/")</script>')
    }
  })
}