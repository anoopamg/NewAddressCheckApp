
    function handleLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');

    // FIX: Check if either field is empty
    if (!user || !pass) {
        errorMsg.textContent = "Username and Password are required.";
        errorMsg.style.display = 'block';
        return;
    }
    
    if (user === 'adminuser' && pass === 'password123') {
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/search.html'; 
    } else {
        errorMsg.textContent = "Either username or password is incorrect.";
        errorMsg.style.display = 'block';
    }
}

