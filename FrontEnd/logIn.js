const emailInput = document.getElementById('userEmail');
const passwordInput = document.getElementById('userPassword');
const loginButton = document.getElementById('login-button');

if (loginButton) {
  loginButton.addEventListener('click', makeLoginRequest);
}

async function makeLoginRequest(event) {
  event.preventDefault();
  const request = new Request('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Adding correct headers
    },
    body: JSON.stringify({
      email: emailInput.value, // Using the input values instead of hardcoded ones
      password: passwordInput.value,
    }),
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      alert("Wrong Password")
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    emailInput.value = '';
    passwordInput.value = '';
    window.location.href = 'index.html';
    sessionStorage.setItem('authToken', json.token);
  } catch (error) {
    console.error(error.message);
  }
}