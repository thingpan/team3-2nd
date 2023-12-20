let matchData = [];
let teamInfo;
let awayTeamName;

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }
});

