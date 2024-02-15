import { Client, ComponentType, Events, InteractionType } from "discord.js";

export default async function runInteraction(client: Client, interactionI: InteractionInterface) {
    client.on(Events.InteractionCreate, async (interact) => {
        if (interact.type != InteractionType.MessageComponent || interact.componentType != interactionI.componentType 
            || !interact.customId.includes(interactionI.customId))
            return;

        await interactionI.action(interact);
    });
}