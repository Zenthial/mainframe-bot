import { Client, Collection, Intents } from "discord.js"
import { userInputModelFunction } from "./functions/modalFunctions.js"
import { DISCORD_TOKEN } from "./secrets.js"
import { load_slash_commands } from "./slash_command_loader.js"
import { CommandInterface } from "./types/command_interface.js"

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
            if (interaction.commandName === "wij-help") {
                await command.execute(interaction, commandsCollection);
            } else {
                await command.execute(interaction);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    })

    client.on("interactionCreate", async interaction => {
        if (!interaction.isModalSubmit()) return;

        let interaction_split = interaction.customId.split("-")
        if (interaction_split[0] === "userInputEventsModal") {
            await userInputModelFunction(interaction, Number.parseInt(interaction_split[1]), true)
        } else if (interaction_split[0] === "userInputPointsModal") {
            await userInputModelFunction(interaction, Number.parseInt(interaction_split[1]), false)
        }
    })

    client.login(DISCORD_TOKEN)
}

main()