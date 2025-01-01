import { Application, ApplicationCommand, ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, TextChannel } from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";


export default class Kick extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "timeout",
            description: "Manage timeouts",
            category: Category.Moderation,
            default_member_permissions: PermissionFlagsBits.MuteMembers,
            dm_permission: false,
            cooldown: 3,
            dev: false,
            options: [
                {
                    name: "add",
                    description: "Add a timeout to a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select a member to timeout",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "length",
                            description: "Length of the timeout",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                            choices: [
                                { name: "5 Minutes", value: "5m" },
                                { name: "10 Minutes", value: "10m" },
                                { name: "15 Minutes", value: "15m" },
                                { name: "30 Minutes", value: "30m" },
                                { name: "45 Minutes", value: "45m" },
                                { name: "1 Hour", value: "1h" },
                                { name: "2 Hours", value: "2h" },
                                { name: "6 Hours", value: "6h" },
                                { name: "12 Hours", value: "12h" },
                                { name: "1 Day", value: "1d" },
                                { name: "3 Days", value: "3d" },
                                { name: "5 Days", value: "5d" },
                                { name: "1 Week", value: "1w" },
                                { name: "2 Weeks", value: "2w" },
                                { name: "3 Weeks", value: "3w" },
                                { name: "4 Weeks", value: "4w" }
                              ]
                        },
                        {
                            name: "reason",
                            description: "Reason for a timing out this user",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a timeout from a user",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "target",
                            description: "Select to remove a timeout from",
                            type: ApplicationCommandOptionType.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Reason for untiming out this user",
                            type: ApplicationCommandOptionType.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Don't send a message to the channel",
                            type: ApplicationCommandOptionType.Boolean,
                            required: false,
                        }
                    ]
                },
            ]
        });
    }
};