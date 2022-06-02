import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed  } from "discord.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('status')
        .setDescription('Returns the bots status')

    static execute = async function (interaction: CommandInteraction) {
        let embed = new MessageEmbed()
            .setTitle('Status')
            .setColor("#2C81B9")
            .addField('Uptime', `<t:${Math.floor(Date.now() / 1000) - Math.floor(interaction.client.uptime / 1000)}:F>`)
            .addField('Ping', `${Date.now() - interaction.createdTimestamp} ms`)
            .addField('API Latency', `${Math.round(interaction.client.ws.ping)} ms`)
        await interaction.reply({embeds: [embed]})
    }
}