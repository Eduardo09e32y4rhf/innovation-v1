const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      email: 'admin@admin.com',
      password: '123456'
    });
    console.log('Login success:', response.status);
    console.log('Response body:', response.data);
  } catch (err) {
    if (err.response) {
      console.log('Login failed:', err.response.status);
      console.log('Error data:', err.response.data);
    } else {
      console.log('Error message:', err.message);
    }
  }
}

testLogin();
