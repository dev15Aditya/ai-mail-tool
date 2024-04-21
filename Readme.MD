Tech Stack:

Programming Language: TypeScript
Task Scheduler: BullMQ
OAuth Integration: Google API Client JS, Microsoft Graph API
Context understanding: OpenAI GPT-3
Email Client Integration: OPTIONAL: Nodemailer (for sending demo emails)

Library used: passport passport-google-oauth20 passport-microsoft

# Email Assistant Tool

Overview
This project is a Node.js application built to parse and manage emails from Google and Outlook accounts using OAuth authentication. It utilizes Express.js for the server, EJS for templating, Passport.js for authentication, and integrates with Gmail API and Outlook REST API for email retrieval and sending. The tool also incorporates OpenAI for context understanding and automated replies.

## Features

OAuth authentication with Google and Outlook accounts.
Fetching and displaying emails from connected accounts.
Context understanding using OpenAI to categorize emails.
Automated replies based on email content.
Task scheduling using BullMQ for efficient email processing.

To start the app:

1. In parent directory open terminal and run:
   `nodemon` (It will start the main main server)
2. Open second terminal
   `nodemon worker.js`
3. Open your redis server:`docker run --name redis -d -p 6379:6379 redis`

Then go to `localhost:5500` and login using Google.
I am fetching most recent 5 unread emails (Can be changed from fetchEmail.js)
Unread emails will will be visible on the UI with the label generated using OpenAI.
Our backend server will automatically send reply to unread emails based on the label it will get from GPT.

Note: It takes sometime for gpt to give response so be patient while logging in.

Dependencies
express: Web server framework.
express-session: Session middleware for Express.
passport: Authentication middleware for Node.js.
@microsoft/microsoft-graph-client: Microsoft Graph API client.
@azure/msal-node: Microsoft Authentication Library for Node.js.
bullmq: Task queue for job scheduling.
openai: API client for OpenAI services.

Development
fetchEmails.js: Module for fetching emails from connected accounts.
sendEmail.js: Module for sending emails using Gmail and Outlook APIs.
auth.js: Passport configuration for OAuth authentication.
public/index.html: HTML template for the UI.
views: EJS templates for rendering views.
# ai-mail-tool
# ai-mail-tool
