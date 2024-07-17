import { ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import Subcommand from "../base/classes/SubCommand";

export default class TestOne extends Subcommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "test.one",
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ content: `Test one command has been ran`, ephemeral: true});
    }
}