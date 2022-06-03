import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { createEmbed } from "../functions/createEmbed";
import { getHeadshot, getUserInfo } from "../functions/user_info_requests";
import { checkVerified } from "../functions/verification_requests";

function createBar(cP: number, promotionCPRequirement: number, currentRankCPRequirement: number): string { // From the opensource clan labs bot.
    let percent = Math.round(((Number(cP - currentRankCPRequirement)) / Number(promotionCPRequirement - currentRankCPRequirement)) * 100)
    let multiNumb = Math.floor(percent / 10)

    let retStr = ":ballot_box_with_check: ".repeat(multiNumb) + ":black_square_button: ".repeat(10 - multiNumb)
    retStr += "**" + percent + "%**";

    return retStr;
}

export class Command {
    static data = new SlashCommandBuilder()
        .setName("lookup")
        .setDescription("replies with the looked up user\'s info!")
        .addUserOption(option =>
            option.setName("user-input")
                .setDescription("the user to look up")
                .setRequired(true)
        )

    static execute = async function (interaction: CommandInteraction) {
        // await interaction.deferReply()
        const user = interaction.options.getUser("user-input");

        if (user == null) return await interaction.reply("failed to find user");

        let userId = await checkVerified(user.id);

        if (userId == -1) {
            await interaction.reply("the user you looked up is not verified") // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                await createEmbed(userId, userInfo, interaction);
            }
        }
    }
}