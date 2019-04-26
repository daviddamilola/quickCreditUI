const addClass = (element, myClass) => {
    element.classList.add(myClass);
}

const removeClass = (element, myClass) => {
    element.classList.remove(myClass);
}

const navbtn = document.querySelector('.navBtn');
const navBtn_s = document.querySelectorAll('.navBtn_s');
const closebtn = document.querySelector('.closebtn');
const sideNav = document.querySelector('#mySidenav');
navbtn.addEventListener('click', () => {
    sideNav.style.display = 'block';
}, false)

console.log(navBtn_s);

// navBtn_s.addEventListener('click', () => {
//     sideNav.style.display = 'block';
// }, false)

closebtn.addEventListener('click', () => {
    sideNav.style.display = 'none';
}, false)
