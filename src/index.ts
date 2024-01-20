// Require the necessary discord.js classes
import { ChannelType, Client, Events, GatewayIntentBits, InteractionType, OverwriteType, PermissionFlagsBits } from 'discord.js';
import { token } from './config.json';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
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
    // if (interact.type != InteractionType.)
});
// Log in to Discord with your client's token
client.login(token);
