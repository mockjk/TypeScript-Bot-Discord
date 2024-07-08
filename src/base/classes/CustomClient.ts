import { Client, IconData } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import dotenv from 'dotenv';
import Handler from "./Handler";
dotenv.config()

const TOKEN:IConfig = {
    token: process.env.TOKEN
}

export default class CustomClient extends Client implements ICustomClient{

    handler: Handler;
    config: IConfig;

    constructor(){
        super({ intents: []});

        this.config = (TOKEN as ICustomClient["config"]);
        this.handler = new Handler(this);
    };


    Init(): void {
        this.LoadHandlers();

        this.login(this.config.token)
            .catch((err) => console.error(err));
    };

    LoadHandlers(): void {
        this.handler.LoadEvents();
    };
};