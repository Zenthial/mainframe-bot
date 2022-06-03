import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { checkVerified, handleVerificationRequest } from "../functions/verification_requests.js";

export class Command {
    static data = new SlashCommandBuilder()
        .setName('wij-verify')
        .setDescription('attempts to verify you in the WIJ Mainframe database')
        .addStringOption(option =>
            option.setName("username")
                .setDescription("your username")
                .setRequired(true)
        )

    static execute = async function (interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true })
        const user = interaction.options.getString("username");

        if (user == null) return await interaction.editReply("failed to find user");

        await handleVerificationRequest(user, interaction);
    }
}