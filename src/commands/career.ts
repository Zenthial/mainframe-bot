import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { createEmbed } from "../functions/createEmbed";
import { getHeadshot, getUserInfo } from "../functions/userInfoRequests";
import { checkVerified } from "../functions/verificationRequests";

export class Command {
    static data = new SlashCommandBuilder()
        .setName('career')
        .setDescription('replies with your user info or looks up a specified user!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('the user to lookup')
                .setRequired(false)
        )

    static execute = async function (interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        let userId = -1;

        if (user) {
            userId = await checkVerified(user.id);

            if (userId == -1) {
                return await interaction.reply({ content: `${user.toString()} is not verified. have them run /wij-verify on their account` }) // need to add a reverify feature
            }
        } else {
            userId = await checkVerified(interaction.member?.user.id);
        }

        if (userId == -1) {
            await interaction.reply({ content: "please run /wij-verify to register your account", ephemeral: true }) // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                await createEmbed(userId, userInfo, interaction);
            } else {
                await interaction.reply({ content: "failed to get userInfo", ephemeral: true })
            }
        }
    }
}