import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import ms from "ms";
import os from "os";
const { version, dependencies } = require(`${process.cwd()}/package.json`);
 
export default class BotInfo extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "botinfo",
            description: "Get a bot info",
            category: Category.Utilities,
            default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
            options: [],
            dev: false,
            cooldown: 3,
            dm_permission: false,

        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({ embeds: [new EmbedBuilder()
            .setThumbnail(this.client.user?.displayAvatarURL()!)
            .setColor("Random")
            .setDescription(`
                __**Bot Info**__
                > **User:** \`${this.client.user?.tag}\` - \`${this.client.user?.id}\`
                > **Acount Created:** <t:${(this.client.user!.createdTimestamp  / 1000).toFixed(0)}:R>
                > **Commands:** \`${this.client.commands.size}\`
                > **DJS Version:** \`${version}\`
                > **NodeJS Version:** \`${process.version}\`
                > **Dependencies(${Object.keys(dependencies).length}):** \`${Object.keys(dependencies).map((p) => (`${p}@${dependencies[p]}`).replace(/\^/g, "")).join(", ")}\`
                > **Uptime:** \`${ms(this.client.uptime!, { long: false })}\`

                __**Guild Info**__
                > **Total Guilds:** \`${(await this.client.guilds.fetch()).size}\´
                
                __**System Info**__
                > **Operating System:** \`${process.platform}\`
                > **CPU:** \`${os.cpus()[0].model.trim()}\`
                > **Ram Usage:** \`${this.formatBytes(process.memoryUsage().heapUsed)}\`/\`${this.formatBytes(os.totalmem())}\`

                __**Development Team**__
                > **Creator:** \`Mockjk\`
                > **Developer:** \`Mockjk\`
            `)],
            components: [ new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setLabel("Invite me!")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/oauth2/authorize?client_id=1239027462977884190&permissions=8&integration_type=0&scope=bot"),
                new ButtonBuilder()
                    .setLabel("Support Server")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.gg/gDwcx7YR"),
                // new ButtonBuilder()
                //     .setLabel("Site Server")
                //     .setStyle(ButtonStyle.Link)
                //     .setURL("Site link")
                )
        ]
        })
    }
        
    private formatBytes(bytes: number) {
        if(bytes == 0) return "0";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
    }
}
