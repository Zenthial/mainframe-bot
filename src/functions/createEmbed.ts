import { CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js"
import { createHexagon } from "./createHexagon"
import { UserInfo, getHeadshot } from "./user_info_requests"

function createBar(cP: number, promotionCPRequirement: number, currentRankCPRequirement: number): string { // From the opensource clan labs bot.
    let percent = Math.round(((Number(cP - currentRankCPRequirement)) / Number(promotionCPRequirement - currentRankCPRequirement)) * 100)
    let multiNumb = Math.floor(percent / 10)

    let retStr = ":ballot_box_with_check: ".repeat(multiNumb) + ":black_square_button: ".repeat(10 - multiNumb)
    retStr += "**" + percent + "%**";

    return retStr;
}

export async function createEmbed(userId: number, userInfo: UserInfo, interaction: CommandInteraction) {
    // const profileBuffer = await createHexagon(userId)
    // const attachment = new MessageAttachment(profileBuffer, `profileCanvas${userId}.png`)

    let embed = new MessageEmbed()
        .setTitle(`${userInfo.rank} ${userInfo?.name}`)
        .setURL(`https://www.roblox.com/users/${userId}/profile`)
        .setColor("#2C81B9")
        .setDescription(`${userInfo.rank} ${userInfo.points} battlePoints`)
        .setThumbnail(await getHeadshot(userId))

    if (userInfo.floor_points != null && userInfo.goal_points != null) {
        embed.addField(`Progress to your next promotion (${userInfo.goal_points} bP Required)`, createBar(userInfo.points, userInfo.goal_points!, userInfo.floor_points!))
    } else {
        if (userInfo.rank == "Sergeant Major of the Alliance") embed.addField("**Maximum Rank Achieved**", "You are the highest ranked individual within the alliance. Congratulations, Sergeant Major!")
        if (userInfo.rank == "Ensign") embed.addField("**Maximum Rank Achieved**", "Promotion to Lieutenant requires Council and HICOM approval, and excellent performance as an NCO")
        if (userInfo.rank == "Lieutenant") embed.addField("**Maximum Rank Achieved**", "Promotion to Captain requires HICOM approval, with a HICOM member selecting you to work with them")
        if (userInfo.rank == "Captain") embed.addField("**Maximum Rank Achieved**", "Promotion to Colonel requires unanimous HICOM approval.")
        if (userInfo.rank == "Colonel") embed.addField("**Maximum Rank Achieved**", "Promotion to Marshal requires sucking up to the Chairman.")
        if (userInfo.rank == "Marshal") embed.addField("**Maximum Rank Achieved**", "Promotion to Chairman requires assassinating the Chairman.")
        if (userInfo.rank == "Chairman") embed.addField("**Maximum Rank Achieved**", "idk you cant get promoted why are you looking here.")
        if (userInfo.rank == "Veteran") embed.addField("**Maximum Rank Achieved**", "idk you cant get promoted why are you looking here.")
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
    embed.setFooter({ text: "Mainframe", iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

    await interaction.reply({ embeds: [embed] /*, files: [attachment]*/ })
}
