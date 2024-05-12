import { Client, IconData } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import dotenv from 'dotenv';
dotenv.config()

const TOKEN:IConfig = {
    token: process.env.TOKEN
}

export default class CustomClient extends Client implements ICustomClient{

    config: IConfig;

    constructor(){
        super({ intents: []});

        this.config = (TOKEN as ICustomClient["config"]);
    };

    Init(): void {
        this.login(this.config.token)
            .then(() => console.log("🟢 Logged in!"))
            .catch((err) => console.error);
    };

};