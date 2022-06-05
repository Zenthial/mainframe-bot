import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction, MessageEmbed } from "discord.js";
import { CommandInterface } from "../types/command_interface";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('wij-help')
        .setDescription('Returns the bots possible command')

    static execute = async function (interaction: CommandInteraction, commands: Collection<string, CommandInterface>) {
        let embed = new MessageEmbed()
            .setTitle('Help')
            .setColor("#2C81B9")

        commands.map(command => embed.addField(command.data.name, command.data.description))

        embed.setTimestamp()
        embed.setFooter({ text: "Mainframe", iconURL: "https://tr.rbxcdn.com/06438e6203c5f222fe47d45e9e6941e2/150/150/Image/Png" })

        await interaction.reply({ embeds: [embed] })
    }
}