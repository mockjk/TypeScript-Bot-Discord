import { Client, Collection, IconData } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import { IConfig } from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import Subcommand from "./SubCommand";

export default class CustomClient extends Client implements ICustomClient{

    handler: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    subCommands: Collection<string, Subcommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    constructor(){
        super({ intents: [] });

        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler(this);
        this.commands = new Collection();
        this.subCommands = new Collection();
        this.cooldowns = new Collection();
    };


    Init(): void {
        this.LoadHandlers();

        this.login(this.config.token)
            .catch((err) => console.error(err));
    };

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    };
};