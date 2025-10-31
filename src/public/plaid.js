import { btnLinkAccountEl } from './common.js';

async function createLinkToken() {
  const resp = await fetch('/api/create_link_token', { method: 'POST' });
  console.log('From plaid in raw:', resp);
  if (!resp.ok) {
    throw new Error('create_link_token failed');
  }
  const data = await resp.json();
  console.log('From plaid in JSON:', data);
  return data;
}

async function initializeLink() {
  try {
    // create and get link token - client calls app server <-> app server <-> talks to plaid - passes back link token

    const { link_token } = await createLinkToken();
    console.log('LINK TOKEN->', link_token);

    // here is where the client calls plaid, creates a link handler (via Plaid Link web app, handler.open() call )
    // - gets a public_token back from plaid - then sends public_token to server

    // set up
    const handler = Plaid.create({
      token: link_token,
      onSuccess: async (public_token, metadata) => {
        console.log('PUBLIC TOKEN->', public_token);
        // Send public_token to server to exchange for access_token
        const resp = await fetch('/api/exchange_public_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // convert from javascript to JSON
          body: JSON.stringify({ public_token }),
        });
        // convert from JSON to javascript
        const data = await resp.json();
        console.log(JSON.stringify({ metadata, exchangeResult: data }, null, 2));
        //out({ metadata, exchangeResult: data });
      },
      onExit: (err, metadata) => {
        out({ err, metadata });
      },
    });
    handler.open();
  } catch (e) {
    out({ error: e.message });
  }
}

const btnLinkAccount_ClickHandler = (event) => {
  initializeLink();
};

btnLinkAccountEl.addEventListener('click', btnLinkAccount_ClickHandler);
