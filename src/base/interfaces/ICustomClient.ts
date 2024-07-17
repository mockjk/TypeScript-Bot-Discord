import { Collection } from "discord.js";
import Command from "../classes/Command";
import Subcommand from "../classes/SubCommand";
import { IConfig } from "./IConfig";

export default interface ICustomClient {
    config: IConfig
    commands: Collection<string, Command>;
    subCommands: Collection<string, Subcommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    Init(): void;
    LoadHandlers(): void;
};