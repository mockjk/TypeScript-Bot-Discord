import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, TextChannel } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Subcommand from "../../base/classes/SubCommand";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class BanAdd extends Subcommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "ban.add",
    })
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason = interaction.options.getString("reason") || "No reason was provided";
    const days: number = interaction.options.getInteger("days") || 0;
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if(!target)
        return interaction.reply({ embeds: [errorEmbed
            .setDescription(`❌ Please provide a valid user!`)
        ], ephemeral: true});

    if(target.id == interaction.user.id)
        return interaction.reply({ embeds: [errorEmbed
            .setDescription(`❌ You cannot ban yourself`)
        ], ephemeral: true});

    if(target.roles.highest.position >= (interaction.member!.roles as GuildMemberRoleManager).highest.position)
        return interaction.reply({ embeds: [errorEmbed
            .setDescription(`❌ You cannot ban a user with a higher or equal roles than you!`)
        ], ephemeral: true});
    
    if(!target.bannable)
        return interaction.reply({ embeds: [errorEmbed
            .setDescription(`❌ This user cannot be banned!`)
        ], ephemeral: true});
    
    if(reason.length > 512)
        return interaction.reply({ embeds: [errorEmbed
            .setDescription(`❌ This reason cannot be longer than 512 characters!`)
        ], ephemeral: true});

    try {
        await target.send({ embeds: [ new EmbedBuilder()
            .setColor("Red")
            .setDescription(`
            🔨 You were **banned** from \`${interaction.guild?.name}\` by ${interaction.member}
            If you would like to appel your ban, send a message to the moderator who banned you.

            **Reason: ** \`${reason}\`
            `)
        ]});
    } catch {
        //Do nothing
    };
    try {
        await target.ban({ deleteMessageSeconds: days, reason: reason});
    } catch {
        return interaction.reply({ embeds: [ errorEmbed
            .setDescription(`❌ An error occured while trying to ban this user, please try again!`)
        ], ephemeral: true});
    };

    interaction.reply({ embeds: [ new EmbedBuilder()
        .setColor("Red")
        .setDescription(`🔨 Banned ${target} - \`${target.id}\``)
    ], ephemeral: true});

    if(!silent)
        interaction.channel?.send({ embeds: [ new EmbedBuilder()
            .setColor("Red")
            .setThumbnail(target.displayAvatarURL({ size: 64}))
            .setAuthor({ name: `🔨 Ban | ${target.user.tag}`})
            .setDescription(`
                **Reason:** \`${reason}\`
                ${days == 0 ? "" : `This users messages in the last \`${(days / 60) / 60}\` hours have been deleted`}
            `)
            .setTimestamp()
            .setFooter({ text: `Id: ${target.id}`})
        ]})
        .then(async(x) => await x.react("🔨"));

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId});

    if(guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation?.channelId)
        (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel)?.send({ embeds: [
            new EmbedBuilder()
            .setColor("Red")
            .setThumbnail(target.displayAvatarURL({ size : 64}))
            .setAuthor({ name: "🔨 Ban"})
            .setDescription(`
            **User:** ${target} - \`${target.id}\`
            **Reason:** \`${reason}\`
            ${days == 0 ? "" : `This users messages in the last \`${(days / 60) / 60}\` hours have been deleted`}
            `)
            .setTimestamp()
            .setFooter({
                text: ` Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL({}),
            })
        ]});

  };
};
