const toggleVisibility = `
function toggleVisibility(id) {
  var e = document.getElementById(id);
  if(e.style.display === 'block') {
    e.style.display = 'none';
  }
  else {
    e.style.display = 'block';
  }
}`

const toggleMaxWidth = `
function toggleMaxWidth(e) {
  if(e.className === 'small-img') {
    e.className = 'big-img';
  }
  else {
    e.className = 'small-img';
  }
}`

function post(action) {
	return `
  function ${action} () {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/${action}', true);

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        window.open('', '_self', ''); window.close();
      }
    }
    xhr.send(""); 
  }`
}

module.exports = {
	toggleMaxWidth,
	toggleVisibility,
	reject: post('reject'),
	accept: post('acceptTest'),
}

