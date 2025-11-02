"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Client ID:', process.env.PLAID_CLIENT_ID);
console.log('Secret:', process.env.PLAID_SECRET);
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const plaid_1 = require("plaid");
const errorUtils_1 = require("./errorUtils");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.static('./public'));
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
let PLAID_ENV;
if (process.env.PLAID_ENV) {
    PLAID_ENV = process.env.PLAID_ENV;
}
else {
    PLAID_ENV = 'sandbox';
}
const config = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments[PLAID_ENV.toLowerCase()],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        },
    },
});
const client = new plaid_1.PlaidApi(config);
let ACCESS_TOKEN = null;
let ITEM_ID = null;
app.post('/api/create_link_token', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('client request: ', _req.body);
    try {
        const request = {
            user: { client_user_id: 'user-id-123' },
            client_name: 'Quickstart App',
            products: [plaid_1.Products.Transactions],
            country_codes: [plaid_1.CountryCode.Us],
            language: 'en',
        };
        console.log('To plaid', request);
        const resp = yield client.linkTokenCreate(request);
        res.json(resp.data);
    }
    catch (err) {
        const e = (0, errorUtils_1.toPlaidError)(err);
        console.error(e);
        res.status(500);
        let errorMessage;
        if (e.response && e.response.data) {
            errorMessage = e.response.data;
        }
        else {
            errorMessage = e.message;
        }
        res.json({ error: errorMessage });
    }
}));
app.post('/api/exchange_public_token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { public_token } = req.body;
    try {
        const exchangeResp = yield client.itemPublicTokenExchange({ public_token });
        ACCESS_TOKEN = exchangeResp.data.access_token;
        ITEM_ID = exchangeResp.data.item_id;
        res.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID });
    }
    catch (err) {
        const e = (0, errorUtils_1.toPlaidError)(err);
        console.error(e);
        res.status(500).json({ error: ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message });
    }
}));
let PORT;
if (process.env.PORT) {
    PORT = process.env.PORT;
}
else {
    PORT = 8000;
}
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
//# sourceMappingURL=server.js.map