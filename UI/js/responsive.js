const navbtn = document.querySelectorAll('.navBtn');
const navBtn_s = document.querySelectorAll('.navBtn_s');
const closebtn = document.querySelector('.closebtn');
const sideNav = document.querySelector('.sidenav-wrapper');
const sideNavLinks = document.querySelectorAll('.sideNavItem > a');



Array.from(sideNavLinks).forEach(link => link.addEventListener('click', () => {
    sideNav.style.display = 'none';
}, false));

Array.from(navbtn).forEach(x => {
    x.addEventListener('click', () => {
        sideNav.style.display = 'block';
    }, false)
})


const hideSideNav = () => {
    sideNav.style.display = 'none';
};

sideNav.addEventListener('click', hideSideNav);
closebtn.addEventListener('click', hideSideNav, false)



