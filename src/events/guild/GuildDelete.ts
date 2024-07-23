import { Events, Guild } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import GuildsConfig from "../../base/schemas/GuildConfig";

export default class GuildDelete extends Event{
    constructor(client: CustomClient){
        super(client, {
            name: Events.GuildDelete,
            description: "Guild leave event",
            once: false
        })
    };

   async Execute(guild: Guild) {
        try {
            await GuildsConfig.deleteOne({ guildId: guild.id})
        } catch (err){
            console.error(err)
        };
    };
};