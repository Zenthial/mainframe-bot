import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('status')
        .setDescription('Returns the bots status')

    static execute = async function (interaction: CommandInteraction) {
        let embed = new MessageEmbed()
            .setTitle('Status')
            .setColor("#2C81B9")
            .addField('Uptime', `<t:${Math.floor(Date.now() / 1000) - Math.floor(interaction.client.uptime! / 1000)}:F>`)
            .addField('Ping', `${Date.now() - interaction.createdTimestamp} ms`)
            .addField('API Latency', `${Math.round(interaction.client.ws.ping)} ms`)

        embed.setTimestamp()
        embed.setFooter({ text: "Mainframe", iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })
        await interaction.reply({ embeds: [embed] })
    }
}