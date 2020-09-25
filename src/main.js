const socket = io()

function search() {
  socket.emit('search', document.getElementById('user').value)
  document.getElementById('searchtable').innerHTML = `<th>검색순위</th>
  <th>ID</th>
  <th>유저네임</th>
  <th>쉘터이름</th>
  <th>추가</th>
  <tr >
  <td>검색중</td>
  <td>검색중</td>
  <td>검색중</td>
  <td>검색중</td>
  <td>검색중</td>
  </tr>`
}

let already = []

socket.on('result', (json) => {
  document.getElementById('searchtable').innerHTML = `<th>검색순위</th>
  <th>ID</th>
  <th>유저네임</th>
  <th>쉘터이름</th>
  <th>추가</th>`
  
  if (!json) {
    document.getElementById('searchtable').innerHTML = document.getElementById('searchtable').innerHTML + ` <tr >
    <td>없음</td>
    <td>없음</td>
    <td>없음</td>
    <td>없음</td>
    <td>없음</td>
    </tr>`
    return
  }

  json.content.forEach((item, index) => {
    if (item.name === null) return
    document.getElementById('searchtable').innerHTML = document.getElementById('searchtable').innerHTML +  `
    <tr >
      <td>${index}</td>
      <td>${item.id}</td>
	    <td>${item.owner.name}</td>
      <td>${item.name}</td>
      <td><button type="button" class=" btn btn-nord btn-sm text-white mr-1"onclick="add('${item.id}', '${item.owner.name}')">추가</button></td>
	  </tr>`
  })
})

function add(name, name2) {
  if (already.includes(name)) return Swal.fire({ position: 'top-end', html: '<a style="font-weight: bold;">이미 추가된 쉘터 입니다!</a>', showConfirmButton: false, timerProgressBar: true, timer: 700 })
  if (already.length >= 10) return Swal.fire({ position: 'top-end', html: '<a style="font-weight: bold;">최대 10개의 쉘터만 등록가능합니다!</a>', showConfirmButton: false, timerProgressBar: true, timer: 700 })
  already.push(name)
  document.getElementById('tag').value = document.getElementById('tag').value + name + ','
  Swal.fire({
    position: 'top-end',
    html: '<a style="font-weight: bold;">추가되었습니다! : ' + name2 + '</a>',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 700
  })
}

const checkbox = document.getElementById('selfallowcheck')

checkbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    alert(Date.now() + ' : 개인정보 수집 및 이용동의를 수락하셨습니다')
  } else {
    alert(Date.now() + ' : 개인정보 수집 및 이용동의를 거부하셨습니다')
  }
})

setInterval(() => {
  document.getElementById('tag').value === '' || document.getElementById('email').value === '' || document.getElementById('passwd').value === '' || document.getElementById('selfallowcheck').checked === false ? document.getElementById('submit').disabled = true : document.getElementById('submit').disabled = false
}, 500)