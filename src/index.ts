// Require the necessary discord.js classes
import { ChannelType, Client, Events, GatewayIntentBits, InteractionType, OverwriteType, PermissionFlagsBits } from 'discord.js';
import { token, Langauges } from './configs/config.json';
import fs from 'fs';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const genericLangaugeConfig: LangaugeConfig = {
    languagePrompt: "<Please select your langauges.>",
    interactions: [
        {
            prompt: "What are your interests?",
            responses: [
                {
                    content: "Gaming",
                    role: "roleidhere"
                },
                {
                    content: "Art",
                    role: "roleidhere"
                },
                {
                    content: "Anime",
                    role: "roleidhere"
                },
                {
                    content: "Music",
                    role: "roleidhere"
                }
            ]
        }
    ],
    rules: [
        "Rule #1: Flunky7 is the best bot.",
        "Rule #2: Yuo must praise Flunky7.",
        "Rule #3: Flunky7 will hunt down those who speak back.",
    ]
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, async member => {
    let guild = member.guild;

    let channel = await guild.channels.create({
        name: "Welcome!",
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                allow: PermissionFlagsBits.ViewChannel,
                id: member.id,
                type: OverwriteType.Member,
            },
            {
                allow: PermissionFlagsBits.SendMessages,
                id: member.id,
                type: OverwriteType.Member,
            },
            {
                deny: PermissionFlagsBits.ViewChannel,
                id: guild.roles.everyone,
                type: OverwriteType.Member,
            },
        ]
    });

    //create channel handler.
})

client.on(Events.InteractionCreate, async interact => {
    // if (interact.type != InteractionType.MessageComponent)
});

for (const language of Langauges) {
    if (!fs.existsSync(`./configs/${language.Name}-config.json`))
        fs.writeFileSync(`./configs/${language.Name}-config.json`, JSON.stringify(genericLangaugeConfig));
}
// Log in to Discord with your client's token
// client.login(token);
