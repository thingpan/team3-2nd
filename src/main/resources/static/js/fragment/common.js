function redirectToLoginPage() {
    window.location.href = "/page/user/login";
}

function redirectToRegistrationPage() {
    window.location.href = "/page/user/join";
}

function logout() {
    window.location.href = "/auth/logout";
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.navbar__toggleBtn');

    if (toggleBtn) {
        const links = document.querySelector('.navbar__menu');
        const userMenu = document.querySelector('.user-menu');

        toggleBtn.addEventListener('click', () => {
            if (links) {
                links.classList.toggle('active');
            }
            if (userMenu) {
                userMenu.classList.toggle('active');
            }
        });
    }
});