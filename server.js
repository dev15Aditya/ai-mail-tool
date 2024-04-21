const express = require('express');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const path = require('path');
const { file } = require('googleapis/build/src/apis/file');
const fs = require('fs').promises;
// const replyToEmails = require('./sendEmail');
const sendMessage = require('./sendEmail');

const fetchEmails = require('./fetchEmails');

const app = express();
const PORT = 3000;

// const { Queue } = require('bullmq');

// const notificationQueue = new Queue('email-queue', {
//   connection: {
//     host: 'localhost',
//     port: 6379,
//   },
// });

// async function init(data) {
//   const res = await notificationQueue.add('email', {
//     email: data.to,
//     from: data.from,
//     subject: data.subject,
//     body: data.text,
//   });
//   console.log('Job added to queue', res.id);
// }

app.set('view engine', 'ejs');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/auth/google', async (req, res) => {
  try {
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    const gmail = google.gmail({ version: 'v1', auth });

    const userInfo = await gmail.users.getProfile({ userId: 'me' });
    const userId = userInfo.data.emailAddress;

    const emails = await fetchEmails(auth);

    for (let email of emails) {
      const message = createEmail(
        email.senderEmail,
        userId,
        'Auto reply test',
        email.reply
      );
      createEmail;
      await sendMessage(auth, message);
      console.log('Email sent successfully to:', email.senderEmail);
    }

    // await replyToEmails(emails, userId);

    if (auth.credentials) {
      await saveCredentials(auth);
      res.render('index.ejs', { name: auth.credentials.name, emails });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).send('Authentication failed.');
  }
});

async function replyToEmails(emails, userId) {
  try {
    for (let email of emails) {
      const to = email.email;
      const from = userId;
      const subject = email.subject;
      const text = email.body;
      const message = createEmail(to, from, subject, text);
      await sendMessage(message);
      console.log('Email sent successfully to:', to);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

function createEmail(to, from, subject, messageText) {
  const email = [
    `Content-Type: text/plain; charset="UTF-8"\n`,
    `MIME-Version: 1.0\n`,
    `Content-Transfer-Encoding: 7bit\n`,
    `to: ${to}\n`,
    `from: ${from}\n`,
    `subject: ${subject}\n\n`,
    messageText,
  ].join('');

  return email;
}

app.post('/logout', async (req, res) => {
  try {
    res.redirect('/');
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send('Logout failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
