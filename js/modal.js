const modal = document.getElementById("myModal");
const btnArray = Array.from(document.querySelectorAll('reject'));
const span = document.getElementsByClassName("close")[0];

btnArray.forEach(btn => btn.addEventListener('click', function (e) {
  e.preventDefault();
  modal.style.display = 'block'
}, false))

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}