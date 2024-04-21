const { google } = require('googleapis');

async function sendMessage(auth, message) {
  const gmail = google.gmail({ version: 'v1', auth });

  const rawMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    console.log('Sending email...');
    await gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: rawMessage,
      },
    });
  } catch (error) {
    console.error('Error message:', error);
  }
}

module.exports = sendMessage;

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

async function replyToEmails(auth, data) {
  try {
    const to = data.to;
    const from = data.from;
    const subject = data.subject;
    const text = data.text;

    const message = createEmail(to, from, subject, text);

    await sendMessage(auth, message);
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// module.exports = replyToEmails;
