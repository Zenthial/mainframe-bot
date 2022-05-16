import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from "discord.js";

export class Command {
    static data = new SlashCommandBuilder()
        .setName('add')
        .setDescription('adds an event to a user')
        .addNumberOption(option =>
            option.setName("event-type")
                .setDescription("the event to be added to the user")
                .setRequired(true)
                .addChoices({ name: "raid", value: 5 }, { name: "defense", value: 5 }, { name: "training", value: 3 })
        )

    static execute = async function (interaction: CommandInteraction) {
        await interaction.reply('works!');
    }
}