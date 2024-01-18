// Require the necessary discord.js classes
import { ChannelType, Client, Events, GatewayIntentBits } from 'discord.js';
import { token } from './config.json';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.GuildMemberAdd, member => {
    member.guild.channels.create({name: "Welcome!", type: ChannelType.GuildText})
})

// Log in to Discord with your client's token
client.login(token);
