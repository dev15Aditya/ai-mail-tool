function sendEmail() {
  const emailContent = document.getElementById('emailContent').value;
  console.log('Sending email with content: ', emailContent);
}

document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners to the buttons
  document.getElementById('loginGmail').addEventListener('click', () => {
    initiateLogin('google');
  });

  document.getElementById('loginOutlook').addEventListener('click', () => {
    initiateLogin('microsoft');
  });
});

// Function to initiate login with Google or Microsoft
function initiateLogin(provider) {
  // Make a GET request to the server endpoint for the corresponding authentication
  fetch(`/auth/${provider}`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Login with ${provider} initiated`);
        // You can perform any additional actions here after initiating the login
      } else {
        console.error(`Failed to initiate login with ${provider}`);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
