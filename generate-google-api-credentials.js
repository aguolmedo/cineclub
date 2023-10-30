const fs = require('fs');

require('dotenv').config();

const credentials = {
  type: 'service_account',
  project_id: process.env.GC_PROJECT_ID,
  private_key_id: process.env.GC_PRIVATE_KEY_ID,
  private_key: process.env.GC_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  client_email: process.env.GC_CLIENT_EMAIL,
  client_id: process.env.GC_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.GC_CLIENT_x509_CERT_URL,
  universe_domain: 'googleapis.com',
};

fs.writeFileSync(
  'cineclub-service-account.json',
  JSON.stringify(credentials, null, 2),
);
