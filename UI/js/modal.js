// referenced from w3 schools

const modal = document.getElementById("myModal");
const aModal = document.getElementById("aModal");
const approveBtns = document.querySelectorAll('.approve')
const rejectBtns = document.querySelectorAll('.reject')
const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("close2")[0];

approveBtns.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  aModal.style.display = "block";
}, false));
rejectBtns.forEach(btn => btn.addEventListener('click', (e) => {
  e.preventDefault();
  modal.style.display = "block";
}, false));

span.onclick = function () {
  modal.style.display = "none";
}
span2.onclick = function () {
  aModal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}