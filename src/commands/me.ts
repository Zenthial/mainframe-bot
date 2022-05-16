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
                let embed = new MessageEmbed()
                    .setTitle(`${userInfo.rank} ${userInfo?.name}`)
                    .setColor("#2C81B9")
                    .setDescription(`${userInfo.rank} ${userInfo.points} cP`)
                    .setThumbnail(await getHeadshot(userId))

                if (userInfo.floor_points != null && userInfo.goal_points != null) {
                    embed.addField(`Progress to your next promotion (${userInfo.goal_points} cP Required)`, createBar(userInfo.points, userInfo.floor_points!, userInfo.goal_points!))
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