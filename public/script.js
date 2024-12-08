document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    if (!username || !password) {
        messageDiv.textContent = 'Please fill in all fields.';
        messageDiv.style.color = 'red';
        return;
    }

    fetch('http://127.0.0.1/library/public/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                messageDiv.textContent = 'Registration successful!';
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = data.data.title || 'An error occurred.';
                messageDiv.style.color = 'red';
            }
        })
        .catch(error => {
            messageDiv.textContent = 'Error connecting to the server.';
            messageDiv.style.color = 'red';
            console.error(error);
        });
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    if (!username || !password) {
        messageDiv.textContent = 'Please fill in all fields.';
        messageDiv.style.color = 'red';
        return;
    }

    fetch('http://127.0.0.1/library/public/user/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                messageDiv.textContent = 'Login successful!';
                messageDiv.style.color = 'green';
                console.log('Token:', data.token); // Save or use the token as needed
            } else {
                messageDiv.textContent = data.data.title || 'Authentication failed.';
                messageDiv.style.color = 'red';
            }
        })
        .catch(error => {
            messageDiv.textContent = 'Error connecting to the server.';
            messageDiv.style.color = 'red';
            console.error(error);
        });
});