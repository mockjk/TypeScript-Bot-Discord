"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN = {
    token: process.env.TOKEN
};
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({ intents: [] });
        this.config = TOKEN;
    }
    ;
    Init() {
        this.login(this.config.token)
            .then(() => console.log("🟢 Logged in!"))
            .catch((err) => console.error);
    }
    ;
}
exports.default = CustomClient;
;
