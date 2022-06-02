import axios from "axios"
import { ButtonInteraction, CommandInteraction } from "discord.js";

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

export async function handleVerificationRequest(username: string, interaction: CommandInteraction) {
    let discord_id = interaction.member?.user?.id;
    let body = {
        username: username,
        discord_id: discord_id,
    }
    if (discord_id) {
        let { data } = await axios.put(`http://127.0.0.1:8080/verify/`, body);

        if (data && data.code) {
            await interaction.reply({ content: `you have 5 minutes to verify here: https://www.roblox.com/games/9643349323/WIJ-Verification`, ephemeral: true })
        } else {
            await interaction.reply({ content: `failed to add to the database\n${data}`, ephemeral: true })
        }
    }
}