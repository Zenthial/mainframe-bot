import { Client, Collection, Intents } from "discord.js"
import dotenv from "dotenv"
import { load_slash_commands } from "./slash_command_loader.js"
import { CommandInterface } from "./types/command_interface.js"
import { handleVerificationRequest } from "./verification_requests.js"

dotenv.config()

async function main() {
    const commandsCollection: Collection<string, CommandInterface> = await load_slash_commands()

    process.on("uncaughtException", async unhandledError => {
        console.warn(unhandledError)
    })

    const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

    client.on("ready", () => {
        console.log(`Client logged in`)
    })

    client.on("interactionCreate", async interaction => {
        if (!interaction.isCommand()) return;

        const command = commandsCollection.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    })

    client.on("interactionCreate", async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === "verifyYes") {
            await handleVerificationRequest(interaction)
        } else if (interaction.customId === "verifyNo") {
            interaction.reply({ content: "okay, feel free to verify whenever!", ephemeral: true })
        }
    })

    client.login(process.env.DISCORD_TOKEN)
}

main()