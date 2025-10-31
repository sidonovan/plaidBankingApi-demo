# Plaid Quickstart Banking Demo

A Node.js + Express web app based on Plaid’s Quickstart example, used to explore how financial data APIs work in real-world integrations.

## 🚀 Overview

This project demonstrates a simple end-to-end flow for connecting bank accounts securely using **Plaid Link** and retrieving account and transaction data through the **Plaid API**.

It focuses on:

- Understanding **public_token ↔ access_token** exchange.
- Testing **sandbox** credentials and link sessions.
- Displaying linked account metadata and transaction info.

## 🧰 Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** HTML, CSS, JavaScript (no framework), Typescript
- **Environment:** Plaid Sandbox API

## ⚙️ Features

- Create and exchange link tokens with the Plaid API.
- Launch the Plaid Link flow for sandbox institutions.
- Retrieve linked account metadata and transaction data.
- Log structured JSON responses for analysis and debugging.

## 🧩 In Progress

- Adding TypeScript support for safer and more maintainable code.
- Adding front-end UI to display accounts and transactions.
- Improving error handling and API response visualization.
- Exploring OAuth and redirect flows.

## 💡 What I Learned

- How client/server interaction works in API-based fintech systems.
- Basics of Express route handling, environment variables, and REST API calls.
- Debugging authentication errors and understanding Plaid’s item/token model.

## 🗂️ Setup

- Create a .env file with:

PLAID_CLIENT_ID=your_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

```bash
npm install
node server.js
```

Then visit http://localhost:8000.
