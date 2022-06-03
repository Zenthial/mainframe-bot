import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { createEmbed } from "../functions/createEmbed";
import { getHeadshot, getUserInfo } from "../functions/user_info_requests";
import { checkVerified } from "../functions/verification_requests";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('me')
        .setDescription('Replies with your user info!')

    static execute = async function (interaction: CommandInteraction) {
        let userId = await checkVerified(interaction.member?.user.id);

        if (userId == -1) {
            await interaction.reply({ content: "please run /verify to register your account", ephemeral: true }) // need to add a reverify feature
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