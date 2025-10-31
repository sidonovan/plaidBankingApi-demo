// Loads environment variables from a `.env` file into `process.env`
require('dotenv').config();

console.log('Client ID:', process.env.PLAID_CLIENT_ID);
console.log('Secret:', process.env.PLAID_SECRET);

// Imports the Express library- lightweight framework that makes it easy
// to build web servers and handle HTTP requests/responses in Node.js.
const express = require('express');

// Imports the **body-parser** middleware
// When a client (like a React app) sends data to your server via a POST request (for example, `POST /api/plaid` with JSON data),
// Node doesn’t automatically parse that body.
// `body-parser` reads the incoming request body and converts it into a usable JavaScript object that you can access as `req.body`.

const bodyParser = require('body-parser');

// Imports specific components from the Plaid SDK
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Creates an instance of an **Express application**
const app = express();

// Tells Express to automatically **parse incoming JSON request bodies**
// When a client (like your frontend) sends a request
// The body of that request arrives as raw bytes — not a usable JS object.
// bodyParser.json() reads it, parses the JSON, and makes it available as req.body in your route handlers.

app.use(bodyParser.json());

// Serves static files (like HTML, CSS, JS, or images) from a folder named **`public`**
app.use(express.static('./src/public'));

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
let PLAID_ENV;
// if process.env.PLAID_ENV is defined, not null, or empty
// then set PLAID_ENV = process.end.PLAID_ENV
if (process.env.PLAID_ENV) {
  PLAID_ENV = process.env.PLAID_ENV;
} else {
  PLAID_ENV = 'sandbox';
}

// Creates a new **configuration object** for the Plaid SDK.
const config = new Configuration({
  // sets up sandbox/dev/prod environment/url - returns 'https://sandbox.plaid.com'
  basePath: PlaidEnvironments[PLAID_ENV.toLowerCase()],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});

// Creates a **new Plaid client instance** using the configuration you just set up.
// `client` now has all the Plaid API methods available - client.linkTokenCreate(), client.transactionsGet() etc

const client = new PlaidApi(config);

// In-memory store for demo only - in a real app, you’d store these securely in a database, not in memory.

// Plaid uses an **access token** to identify a specific user’s bank connection (called an **Item**).
//  - You get this token after exchanging a **public token** via `client.itemPublicTokenExchange()`.
//  - You store it so you can make authenticated requests to Plaid later (like fetching transactions).
// Here, it’s stored **in memory**, which means it disappears when the server restarts.
let ACCESS_TOKEN = null;

// Plaid gives every connected bank account (Item) a unique ID.
// Storing the ITEM_ID allows your server to reference this Item later (for logging, updates, or fetching account data).
let ITEM_ID = null;

// 1) Create a POST endpoint at `/api/create_link_token`.
// When the browser (client) calls this route, the server will request a **link token** from Plaid.
// `req` = the incoming request object from the client.
// `res` = the response object you use to send data back to the client.

app.post('/api/create_link_token', async (req, res) => {
  try {
    // Creates the **request object** for Plaid’s `linkTokenCreate` API.
    const request = {
      user: { client_user_id: 'user-id-123' },
      client_name: 'Quickstart App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    };
    // await pauses execution of this async function (not the app) until the Promise returns
    // if the Promise fulfills (resolved), the resolved value is stored in resp
    // If the Promise rejects, control jumps to the catch block
    console.log('To plaid', request);
    const resp = await client.linkTokenCreate(request);
    // Once await finishes and we have the response, we send the JSON (link token) back to the client.
    // This line only runs after the Promise resolves
    res.json(resp.data);
  } catch (err) {
    // If the linkTokenCreate Promise rejects (e.g., network error, API failure), await throws the error
    // The catch block catches it, logs it, and sends a 500 response back to the client
    console.error(err);
    // Set status to 500 (Internal Server Error)
    res.status(500);

    // Figure out what error message to send
    let errorMessage;

    // If the error came from an API (like Plaid), use its response data
    // If err.response exists and it has a data property
    if (err.response && err.response.data) {
      errorMessage = err.response.data;
    } else {
      // Otherwise, use the generic error message
      errorMessage = err.message;
    }

    // Send the JSON response back to client
    res.json({ error: errorMessage });
  }
});

// 2) Exchange public_token (sent from client after successful Link)
app.post('/api/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  try {
    const exchangeResp = await client.itemPublicTokenExchange({ public_token });
    ACCESS_TOKEN = exchangeResp.data.access_token;
    ITEM_ID = exchangeResp.data.item_id;
    res.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// checks if an environment variable named `PORT` exists - if `process.env.PORT` is not defined use `8000`
let PORT;
if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 8000;
}
// tells Express to start listening for HTTP requests on that port.
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
