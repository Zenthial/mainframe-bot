import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { checkVerified } from "../verification_requests.js";

export class Command {
    static data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('wij-verify')
        .setDescription('attempts to verify you in the WIJ Mainframe database')

    static execute = async function (interaction: CommandInteraction) {
        await interaction.deferReply()
        let userId = await checkVerified(interaction.member?.user.id);

        if (userId != -1) {
            await interaction.reply("already verified!") // need to add a reverify feature
        } else {
            let yesButton = new MessageButton()
                .setCustomId("verifyYes")
                .setLabel("YES")
                .setStyle("PRIMARY")

            let noButton = new MessageButton()
                .setCustomId("verifyNo")
                .setLabel("NO")
                .setStyle("SECONDARY")

            let row = new MessageActionRow()
                .addComponents([yesButton, noButton])

            await interaction.reply({ content: "you are not verified! would you like to be verified?", ephemeral: true, components: [row] })
        }
    }
}