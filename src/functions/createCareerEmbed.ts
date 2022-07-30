import { MessageEmbed } from "discord.js"
import { SlidingView } from "../util/sliding_view"
import { UserInfo, getHeadshot, BPLog, getUsernameFromUserId } from "./userInfoRequests"

function createBar(cP: number, promotionCPRequirement: number, currentRankCPRequirement: number): string { // From the opensource clan labs bot.
    if (promotionCPRequirement < cP) {
        cP = promotionCPRequirement
    }
    let percent = Math.round(((Number(cP - currentRankCPRequirement)) / Number(promotionCPRequirement - currentRankCPRequirement)) * 100)
    let multiNumb = Math.floor(percent / 10)
    console.log(promotionCPRequirement, currentRankCPRequirement, multiNumb)
    if (multiNumb == null) { multiNumb = 0 }

    let retStr = ":ballot_box_with_check: ".repeat(multiNumb) + ":black_square_button: ".repeat(10 - multiNumb)
    retStr += "**" + percent + "%**";

    return retStr;
}

export async function createCareerEmbed(userInfo: UserInfo): Promise<MessageEmbed> {
    let embed = new MessageEmbed()
        .setTitle(`${userInfo.rank} ${userInfo?.name}`)
        .setURL(`https://www.roblox.com/users/${userInfo.user_id}/profile`)
        .setColor("#2C81B9")
        .setDescription(`${userInfo.rank} ${userInfo.points} **battlePoints**`)
        .setThumbnail(await getHeadshot(userInfo.user_id))

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

    return embed
}

const MAX_LOGS = 6

function getEvent(amount: number): string {
    if (amount == 3) {
        return "Training"
    } else if (amount == 4) {
        return "Defense"
    } else if (amount == 5) {
        return "Raid"
    } else {
        return "Unknown"
    }
}

let monthTable = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function parseData(date: string): string {
    let split = date.split(" ")
    let date_split = split[0].split("-")
    let year = date_split[0]
    let month = Number.parseInt(date_split[1])
    let day = Number.parseInt(date_split[2])

    let monthString = monthTable[month - 1]

    return `${monthString} ${day}, ${year} @ ${split[1].substring(0, 5)}`
}

export async function createLogsEmbed(userInfo: UserInfo, logs_view: SlidingView<BPLog>, direction: boolean) {
    let log: BPLog | null
    if (direction) {
        log = logs_view.next()
    } else {
        log = logs_view.previous()
    }

    if (log != null) {
        let sign = log.amount > 0 ? "+" : "-"
        let embed = new MessageEmbed()
            .setTitle(`BattlePoint Log`)
            .setColor("#facc28")
            .setDescription(`${getEvent(log.amount).toUpperCase()}`)
            .setThumbnail(await getHeadshot(log.awarder))
            .addField(`AWARDED ${sign}${log.amount} bP`, `By [${await getUsernameFromUserId(log.awarder)}](https://www.roblox.com/users/${userInfo.user_id}/profile) on ${parseData(log.time)}`)

            .setTimestamp()

        if (log.place_name != null) {
            embed.addField("PLACE", `${log.place_name}`)
        }

        return embed
    }

    let e = new MessageEmbed()
    e.setDescription("LOG NOT FOUND")
    return e
}
