import { CommandInteraction } from "discord.js";

// TODO: TOM HOW DO I TYPE sendData TO SUPPORT TEXT OR JSON?? Perhaps eventually get modal support in here? I dunno
export async function sendInteraction(interaction: CommandInteraction, sendData: Text, followup: Boolean = false) {
    if (followup) {
        interaction.followup(sendData);
    } else {
        if (interaction.replied || interaction.deferred) {
            interaction.editReply(sendData);
        } else {
            interaction.reply(sendData)
        }
    }
}