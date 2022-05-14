import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('test')
        .setDescription('Replies with works!')

    static execute = async function (interaction: CommandInteraction) {
        await interaction.reply('works!');
    }
}