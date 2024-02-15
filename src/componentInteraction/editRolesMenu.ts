import { ButtonStyle, ComponentType, StringSelectMenuInteraction } from "discord.js";
import { createActionRow, createButton, createStringMenu, getLanguageConfig } from "../helpers.js";
import { transactionHandler } from "../index.js";

export default class EditRolesMenu implements InteractionInterface {
    public customId = "EditRolesMenu";
    public componentType = ComponentType.StringSelect;

    public async action(interact: StringSelectMenuInteraction) {
        if (!interact.customId.includes(interact.user.id) || !interact.guild)
            return;

        let guildUser = await interact.guild.members.fetch(interact.user);
        let currentInter = transactionHandler.get(guildUser.id);

        for (const roleId of interact.component.options) {
            if (interact.values.includes(roleId.value))
                transactionHandler.addRole(guildUser.id, roleId.value);
            else
                transactionHandler.removeRole(guildUser.id, roleId.value);
        }

        let interactionNum = 0;
        let customId = interact.customId;

        if (currentInter.data.type == transactionPhase.custom)
            interactionNum = parseInt(customId.split(' ')[0]);

        let languageConfig = await getLanguageConfig(guildUser);
        let nextInter = languageConfig.interactions.at(interactionNum);

        if (nextInter) {
            const select = createStringMenu(`${++interactionNum} ${guildUser.id}`, 0, nextInter.responses.length, nextInter.responses, languageConfig.selectionPlaceHolder);
            const row = createActionRow([select]);

            return { content: nextInter.prompt, components: [row] };
        }

        const confirm = createButton('accept', '✅', ButtonStyle.Success);
        const reject = createButton('reject', '❌', ButtonStyle.Danger);

        const row = createActionRow([confirm, reject]);

        await interact.update({ content: languageConfig.rules.join('\n'), components: [row] });
    }
}