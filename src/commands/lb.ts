import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { getLeaderboardView } from "../functions/leaderboardRequests";
import { UserInfo } from "../functions/userInfoRequests";
import { checkVerified } from "../functions/verificationRequests";
import { SlidingView } from "../util/sliding_view";

export function createLbEmbed(queue: SlidingView<UserInfo>, page: number, max_pages: number, direction: boolean): MessageEmbed {
    let embed = new MessageEmbed()
        .setTitle(`BattlePoint Leaderboard - Page **${page}/${max_pages}**`)
        .setColor("#2C81B9")


    let items
    if (direction == true) {
        items = queue.get(10)
    } else {
        items = queue.reverse(10)
    }

    let description = ""
    for (let user of items) {
        description += `**${user.index}.** [${user.name}](https://www.roblox.com/users/${user.user_id}/profile) - ${user.points} bP\n`
    }

    embed.setDescription(description)
    embed.setTimestamp()

    return embed
}

export class Command {
    static data = new SlashCommandBuilder()
        .setName('lb')
        .setDescription('gets the bP leaderboard!')

    static execute = async function (interaction: CommandInteraction) {
        let lb = await getLeaderboardView()
        let rbx_user_id = await checkVerified(interaction.member?.user.id);
        let user_rank = lb.find(rbx_user_id)

        let page = 1
        let max_pages = Math.floor(lb.len() / 10)

        let embed = createLbEmbed(lb, page, max_pages, true)
        embed.setFooter({ text: `Your rank: ${user_rank}/${lb.len()}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

        let forwardButton = new MessageButton().setCustomId("next").setLabel("NEXT").setStyle(MessageButtonStyles.PRIMARY)
        let backwardButton = new MessageButton().setCustomId("back").setLabel("BACK").setStyle(MessageButtonStyles.PRIMARY).setDisabled(true)
        let row = new MessageActionRow()
            .addComponents([backwardButton, forwardButton]);

        const forwardFilter = (i: { customId: string; user: { id: string } }) => i.customId === 'next' && i.user.id === interaction.user.id;
        const backwardFilter = (i: { customId: string; user: { id: string } }) => i.customId === 'back' && i.user.id === interaction.user.id;
        const forwardCollector = interaction.channel!.createMessageComponentCollector({ filter: forwardFilter, time: 60000 })
        const backwardsCollector = interaction.channel!.createMessageComponentCollector({ filter: backwardFilter, time: 60000 })

        forwardCollector!.on("collect", async i => {
            page++;
            if (page != 1) {
                backwardButton.setDisabled(false)
            }
            if (page == max_pages) {
                forwardButton.setDisabled(true)
            }
            let newEmbed = createLbEmbed(lb, page, max_pages, true)
            newEmbed.setFooter({ text: `Your rank: ${user_rank}/${lb.len()}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })
            await i.update({ embeds: [newEmbed], components: [row] })
        })

        backwardsCollector!.on("collect", async i => {
            page--;
            if (page == 1) {
                backwardButton.setDisabled(true)
            }
            if (page != max_pages) {
                forwardButton.setDisabled(false)
            }
            let newEmbed = createLbEmbed(lb, page, max_pages, false)
            newEmbed.setFooter({ text: `Your rank: ${user_rank}/${lb.len()}`, iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })
            await i.update({ embeds: [newEmbed], components: [row] })
        })

        await interaction.reply({ embeds: [embed], components: [row] })
    }
}