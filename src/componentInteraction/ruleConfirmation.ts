import { ButtonInteraction, ComponentType } from "discord.js";
import config from '../../configs/config.json' with { type: "json" };
import { transactionHandler } from "../index.js";

export default class ConfirmRulesButtons implements InteractionInterface {
    customId = "ConfirmRulesButtons";
    componentType = ComponentType.Button;
    public async action(interact: ButtonInteraction) {
        if (!interact.guild)
            return;

        let guildUser = await interact.guild.members.fetch(interact.user);
        const transaction = transactionHandler.get(guildUser.id, true);

        if (interact.customId == "reject") {
            guildUser.roles.add(config.prisonRole);
            return;
        }

        for (const role of transaction.data.addRoles)
            await guildUser.roles.add(role);

        for (const role of transaction.data.removeRoles)
            await guildUser.roles.remove(role);

        await interact.update({ content: "🤗", components: [] });

        setTimeout(async () => await interact.channel?.delete(), 3000);
    }

}