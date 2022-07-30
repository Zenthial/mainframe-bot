import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager, MessageActionRow, MessageActionRowComponent, Modal, TextInputComponent } from "discord.js";
import { checkVerified } from '../functions/verificationRequests';

export class Command {
    static data = new SlashCommandBuilder()
        .setName('remove')
        .setDescription('removes points from a user')
        .addNumberOption(option =>
            option.setName("points")
                .setDescription("the number of points to give")
                .setRequired(true)
        )

    static execute = async function (interaction: CommandInteraction) {
        let roleManager = interaction.member?.roles as GuildMemberRoleManager;
        let hasAdminRole = roleManager.cache.find(role => role.name === "Administrator");

        if (!hasAdminRole) {
            await interaction.reply("you do not have an officer role")
            return;
        }

        const points = interaction.options.getNumber("points")

        if (points == null) return await interaction.reply("failed to get points")

        let rbx_user_id = await checkVerified(interaction.member?.user.id);
        if (rbx_user_id == -1) {
            await interaction.reply("you are not verified. please run /wij-verify")
        }

        const modal = new Modal()
            .setCustomId(`userInputRemovePointsModal-${points}-${rbx_user_id}`)
            .setTitle("user input")

        const userInput = new TextInputComponent()
            .setCustomId("userInput")
            // The label is the prompt the user sees for this input
            .setLabel("Who would you like to remove points from?")
            // Short means only a single line of text
            .setStyle('SHORT');

        let array = new Array<TextInputComponent>()
        array.push(userInput)
        const firstActionRow = new MessageActionRow<TextInputComponent>().addComponents(array);

        modal.addComponents(firstActionRow)

        await interaction.showModal(modal);
    }
}