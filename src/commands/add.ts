import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager, MessageActionRow, Modal, TextInputComponent } from "discord.js";
import { checkVerified } from '../functions/verificationRequests';

export class Command {
    static data = new SlashCommandBuilder()
        .setName('add')
        .setDescription('adds an event to a user')
        .addNumberOption(option =>
            option.setName("event-type")
                .setDescription("the event to be added to the user")
                .setRequired(true)
                .addChoices({ name: "raid", value: 5 }, { name: "defense", value: 4 }, { name: "training", value: 3 })
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
        let rbx_user_id = await checkVerified(interaction.member?.user.id);
        if (rbx_user_id == -1) {
            await interaction.reply("you are not verified. please run /wij-verify")
        }

        const modal = new Modal()
            .setCustomId(`userInputEventsModal-${event_type}-${rbx_user_id}`)
            .setTitle("user input")

        const userInput = new TextInputComponent()
            .setCustomId("userInput")
            // The label is the prompt the user sees for this input
            .setLabel("Who was at your event?")
            // Short means only a single line of text
            .setStyle('SHORT');

        const placeInput = new TextInputComponent()
            .setCustomId("placeInput")
            .setLabel("Where was this event?")
            .setStyle("SHORT")

        const firstActionRow = new MessageActionRow<TextInputComponent>().addComponents(userInput);
        const secondActionRow = new MessageActionRow<TextInputComponent>().addComponents(placeInput);

        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal);
    }
}