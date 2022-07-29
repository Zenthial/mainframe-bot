import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { getLeaderboardQueue } from "../functions/leaderboardRequests";
import { Queue } from "../util/queue";

export function createLbEmbed(queue: Queue, page: number): MessageEmbed {
    let embed = new MessageEmbed()
        .setTitle(`BattlePoint Leaderboard - Page **${page}**`)
        .setColor("#2C81B9")
        .setDescription(`Displaying 10 users`)

    let len = queue.len()
    if (len >= 10) {
        len = 10
    }

    for (let i = 0; i < 10; i++) {
        let user = queue.dequeue()
        let rankNum = (page - 1).toString()
        if (rankNum === "0") {
            rankNum = ""
        }
        embed.addField(`Rank #${rankNum}${i}`, `**${user.name}** - **${user.points}** battlePoints`)
    }

    embed.setTimestamp()
    embed.setFooter({ text: "Mainframe", iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

    return embed
}

export class Command {
    static data = new SlashCommandBuilder()
        .setName('lb')
        .setDescription('gets the bP leaderboard!')

    static execute = async function (interaction: CommandInteraction, lb_state: Collection<string, Queue>) {
        let lb = await getLeaderboardQueue() as Queue
        let page = 1
        let embed = createLbEmbed(lb, page)
        let button = new MessageButton().setCustomId("next").setLabel("NEXT").setStyle(MessageButtonStyles.PRIMARY)
        let row = new MessageActionRow()
            .addComponents(button);

        const filter = (i: { customId: string; user: { id: string } }) => i.customId === 'next' && i.user.id === interaction.user.id;
        const collector = interaction.channel!.createMessageComponentCollector({ filter: filter, time: 60000 })

        collector!.on("collect", async i => {
            page++;
            let newEmbed = createLbEmbed(lb, page)
            await i.update({ embeds: [newEmbed] })
        })

        await interaction.reply({ embeds: [embed], components: [row] })
    }
}