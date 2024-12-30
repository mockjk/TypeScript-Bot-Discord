import { Application, ApplicationCommand, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, TextChannel } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import GuildConfig from "../../base/schemas/GuildConfig";

export default class Kick extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "kick",
      description: "Kick a user from the guild",
      category: Category.Moderation,
      default_member_permissions: PermissionFlagsBits.KickMembers,
      dm_permission: false,
      cooldown: 3,
      dev: false,
      options: [
        {
          name: "target",
          description: "Select a user to kick",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "reason",
          description: "Reason for kicking this user",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "silent",
          description: "Don't send a message to the channel",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    });
  }

  async Execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember("target") as GuildMember;
    const reason = interaction.options.getString("reason") || "No reason given";
    const silent = interaction.options.getBoolean("silent") || false;

    const errorEmbed = new EmbedBuilder().setColor("Red");

    if (!target)
      return interaction.reply({
        embeds: [errorEmbed.setDescription(`❌ Please provide a valid user!`)],
        ephemeral: true,
      });

    if (target.id == interaction.user.id)
      return interaction.reply({
        embeds: [errorEmbed.setDescription(`❌ You cannot kick yourself`)],
        ephemeral: true,
      });

    if ( target.roles.highest.position >= (interaction.member?.roles as GuildMemberRoleManager).highest.position)
      return interaction.reply({
        embeds: [errorEmbed
            .setDescription(
                `❌ You cannot kick a user with equal or higher roles!`
            ),
        ],
        ephemeral: true,
      });

    if (!target.kickable)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(`❌ This user cannot be kicked!   `),
        ],
        ephemeral: true,
      });

    if (reason.length > 512)
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ This reason cannot be longer than 512 characters!`
          ),
        ],
        ephemeral: true,
      });

    try {
      await target.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Orange")
            .setDescription(
              `
            👢 You were **kicked** from \`${interaction.guild?.name}\` by ${interaction.member}.
            If you would like to appeal, send a message to the moderator who kicked you.

            **Reason:** \`${reason}\`
            `
            )
            .setThumbnail(target.displayAvatarURL({ size: 64 })),
        ],
      });
    } catch (err) {
      //Do nothing
    }

    try {
      await target.kick(reason);
    } catch {
      return interaction.reply({
        embeds: [
          errorEmbed.setDescription(
            `❌ An error occured while trying to kick this user, please try again!`
          ),
        ],
        ephemeral: true,
      });
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Orange")
          .setDescription(`👢 Kicked ${target} -  \`${target.id}\``),
      ],
      ephemeral: true,
    });

    if (!silent)
    interaction.channel?.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Orange")
              .setThumbnail(target.displayAvatarURL({ size: 64 }))
              .setAuthor({ name: `👢 Kick | ${target.user.tag} ` })
              .setDescription(
                `
            **Reason:** \`${reason}\`    
            `
              )
              .setTimestamp()
              .setFooter({ text: `ID: ${target.id}` }),
          ],
        })
        .then(async (x) => await x.react("👢"));

    const guild = await GuildConfig.findOne({ guildId: interaction.guildId });

    if (guild && guild?.logs?.moderation?.enabled && guild?.logs?.moderation.channelId)
        (await interaction.guild?.channels.fetch(guild.logs.moderation.channelId) as TextChannel)?.send({
        embeds: [new EmbedBuilder()
            .setColor("Orange")
            .setThumbnail(target.displayAvatarURL())
            .setAuthor({ name: `👢 Kick` })
            .setDescription(
              `
            **User:** ${target} - \`${target.id}\`
            **Reason:** \`${reason}\`    
            `
            )
            .setTimestamp()
            .setFooter({
              text: `Actioned by ${interaction.user.tag} | ${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({}),
            }),
       ]});
  }
}
