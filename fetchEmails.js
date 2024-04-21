const { google } = require('googleapis');
const { OpenAI } = require('openai');

// Analyze the snippet of email and assign label
async function analyzeEmailSentiment(emails) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const newEmails = [];

  for (const email of emails) {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Analyze the sentiment of this email snippet text given and only return either of these words depending on sentiment 'Interested','Not Interested', or 'More information': ${email.snippet}`,
          },
        ],
        model: 'gpt-3.5-turbo',
      });

      console.log('Completion:', completion.choices[0].message.content);

      const sentiment = completion.choices[0].message.content;
      let label;

      console.log('Assigning label to email...');
      if (sentiment === 'Interested') {
        label = 'Interested';
      } else if (sentiment === 'Not Interested') {
        label = 'Not Interested';
      } else {
        label = 'More Information';
      }

      const reply = generateReply(label, email);

      const newEmail = {
        id: email.id,
        snippet: email.snippet,
        label: label,
        senderName: email.senderName,
        senderEmail: email.senderEmail,
        reply: reply,
      };

      newEmails.push(newEmail);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  }

  return newEmails;
}

function generateReply(label, email) {
  let reply = '';

  // Generate reply based on label and email content
  switch (label) {
    case 'Interested':
      reply = `Thank you for expressing interest in our product. We would be happy to provide you with more information. Please let us know if you would like to schedule a demo or have any specific questions.`;
      break;
    case 'Not Interested':
      reply = `Thank you for considering our product. If you have any feedback or questions, feel free to reach out. We're here to assist you.`;
      break;
    case 'More Information':
      reply = `Thank you for reaching out. Could you please provide more details about your inquiry? This will help us assist you better.`;
      break;
    default:
      reply = `Thank you for contacting us. We're here to help. Please let us know how we can assist you.`;
  }

  return reply;
}

async function fetchEmails(auth) {
  const gmail = google.gmail({ version: 'v1', auth });

  const searchResult = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread',
    maxResults: 5,
  });

  const messageIds =
    searchResult.data.messages.map((message) => message.id) || [];

  const promises = messageIds.map((id) =>
    gmail.users.messages.get({ userId: 'me', id })
  );

  const emailDetails = await Promise.all(promises);

  const emails = emailDetails.map((email) => ({
    id: email.data.id,
    snippet: email.data.snippet,
    label: email.data.labelIds[0],
    senderName: email.data.payload.headers.find(
      (header) => header.name === 'From'
    ).value,
    senderEmail: email.data.payload.headers
      .find((header) => header.name === 'From')
      .value.match(/<([^>]+)>/),
  }));

  // return emails;

  console.log('Assigning label to emails...');
  const analyzedEmails = await analyzeEmailSentiment(emails);
  console.log('Emails:', analyzedEmails);

  return analyzedEmails;
}

module.exports = fetchEmails;
