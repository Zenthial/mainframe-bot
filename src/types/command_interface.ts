import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders"

export function staticImplement<T>() {
    return <U extends T>(constructor: U) => { constructor }
}

export interface CommandInterface {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>
}