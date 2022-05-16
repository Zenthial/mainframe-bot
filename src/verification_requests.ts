import axios from "axios"
import { ButtonInteraction } from "discord.js";

interface VerifyPayload {
    roblox_id: number,
    discord_id: number
}

export async function checkVerified(discord_id: string | undefined): Promise<number> {
    if (typeof discord_id === undefined) return -1;

    let { data } = await axios.get(`http://127.0.0.1:8080/verify/discord/${discord_id}`);

    if (data && data.roblox_id) {
        return data.roblox_id
    } else {
        return -1
    }

}

export async function handleVerificationRequest(interaction: ButtonInteraction) {
    let discord_id = interaction.member?.user?.id;
    if (discord_id) {
        let { data } = await axios.get(`http://127.0.0.1:8080/verify/code/${discord_id}`);

        if (data && data.code) {
            await interaction.reply({ content: `your code is ${data.code}`, ephemeral: true })
        } else {
            await interaction.reply({ content: "failed to get a code", ephemeral: true })
        }
    }
}