import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager, MessageActionRow, MessageActionRowComponent, Modal, TextInputComponent } from "discord.js";

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
        let roleManager = interaction.member?.roles as GuildMemberRoleManager;
        let hasAdminRole = roleManager.cache.find(role => role.name === "Marshal" || role.name === "Colonel" || role.name === "Lieutenant" || role.name === "Captain" || role.name === "Administrator");

        if (!hasAdminRole) {
            await interaction.reply("you do not have an officer role")
            return;
        }

        const event_type = interaction.options.getNumber("event-type")

        if (event_type == null) return await interaction.reply("failed to get event type")

        const modal = new Modal()
            .setCustomId(`userInputModel-${event_type}`)
            .setTitle("user input")

        const userInput = new TextInputComponent()
            .setCustomId("userInput")
            // The label is the prompt the user sees for this input
            .setLabel("Who was at your event?")
            // Short means only a single line of text
            .setStyle('SHORT');

        let array = new Array<TextInputComponent>()
        array.push(userInput)
        const firstActionRow = new MessageActionRow().addComponents(array);

        modal.addComponents(firstActionRow)

        await interaction.showModal(modal);
    }
}