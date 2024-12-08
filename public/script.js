// Register JS
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
// Login JS
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
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            messageDiv.textContent = 'Login successful!';
            messageDiv.style.color = 'green';
            
            // Store the token in a cookie
            document.cookie = `token=${data.token}; path=/; max-age=86400`; // 1 day expiry
        } else {
            messageDiv.textContent = data.data?.title || 'An error occurred.';
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'Error connecting to the server.';
        messageDiv.style.color = 'red';
        console.error(error);
    });
});
// Show USERS JS
document.getElementById('loadUsersBtn').addEventListener('click', function() {
    const messageDiv = document.getElementById('message');
    const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    
    // Get token from cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    
    if (!token) {
        messageDiv.textContent = 'Please login to view users.';
        messageDiv.style.color = 'red';
        return;
    }

    fetch('http://127.0.0.1/library/public/user/show', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            messageDiv.textContent = 'Users loaded successfully.';
            messageDiv.style.color = 'green';
            
            // Clear previous users
            usersTable.innerHTML = '';

            // Populate the table with users data
            data.data.forEach(user => {
                const row = usersTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = user.userid;
                cell2.textContent = user.username;
            });
        } else {
            messageDiv.textContent = data.data?.title || 'Error loading users.';
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        messageDiv.textContent = 'Error connecting to the server.';
        messageDiv.style.color = 'red';
        console.error(error);
    });
});
function goBack() {
    window.location.href = 'index.html'; // Redirect to the main page
}