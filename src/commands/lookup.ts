import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { getHeadshot, getUserInfo } from "../user_info_requests";
import { checkVerified } from "../verification_requests";

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
        const user = interaction.options.getUser("user-input");

        if (user == null) return await interaction.reply("failed to find user");

        let userId = await checkVerified(user.id);

        if (userId == -1) {
            await interaction.reply({ content: "the user you looked up is not verified", ephemeral: true }) // need to add a reverify feature
        } else {
            let userInfo = await getUserInfo(userId);

            if (userInfo != null) {
                let embed = new MessageEmbed()
                    .setTitle(`${userInfo.rank} ${userInfo?.name}`)
                    .setColor("#2C81B9")
                    .setDescription(`${userInfo.points} battlePoints`)
                    .setThumbnail(await getHeadshot(userId))

                if (userInfo.floor_points != null && userInfo.goal_points != null) {
                    embed.addField(`Progress to your next promotion (${userInfo.goal_points} bP Required)`, createBar(userInfo.points, userInfo.goal_points!, userInfo.floor_points!))
                }

                if (userInfo.divisions != null) {
                    if (userInfo.divisions.st != null) {
                        embed.addField("**WIJST**", userInfo.divisions.st, true)
                    }

                    if (userInfo.divisions.sable != null) {
                        embed.addField("**SABLE**", userInfo.divisions.sable, true)
                    }
                }

                embed.setTimestamp()

                await interaction.reply({ embeds: [embed] })
            }
        }
    }
}