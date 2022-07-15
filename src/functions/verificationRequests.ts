import axios from "axios"
import { ButtonInteraction, CommandInteraction } from "discord.js";

interface VerifyPayload {
    roblox_id: number,
    discord_id: number
}

export async function checkVerified(discord_id: string | undefined): Promise<number> {
    if (typeof discord_id === undefined) return -1;

    return await axios.get(`http://127.0.0.1:8080/verify/${discord_id}`).then(response => {
        let data = response.data
        if (data && data.roblox_id) {
            return data.roblox_id
        } else {
            return -1
        }
    }).catch(_ => {
        return -1
    });
}

export async function handleVerificationRequest(username: string, interaction: CommandInteraction) {
    let discord_id = interaction.member?.user?.id;
    let body = {
        roblox_username: username,
        discord_id: discord_id,
    }
    if (discord_id) {
        await axios.put(`http://127.0.0.1:8080/verify/`, body).then(async () => {
            await interaction.editReply(`you have 5 minutes to verify here: https://www.roblox.com/games/9643349323/WIJ-Verification`);
        }).catch(async e => {
            await interaction.editReply(`failed to add to the database\n${e}`)
        });
    }
}