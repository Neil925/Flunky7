import { ButtonStyle, ComponentType, GuildMember, InteractionType, StringSelectMenuInteraction } from "discord.js";
import { createActionRow, createButton, createStringMenu, getLanguageConfig, interactionAddRoles, returnInteraction } from "../helpers.js";

export default class GiveRoleMenu implements InteractionInterface {
    public interactionType = InteractionType.MessageComponent;
    public componentTeype = ComponentType.StringSelect;

    public async action(interact: StringSelectMenuInteraction) {
        if (!interact.customId.includes(interact.user.id) || !interact.guild)
            return;

        let guildUser = await interact.guild.members.fetch(interact.user);
        let currentInter = returnInteraction(guildUser.id);

        for (const roleId of interact.values)
            interactionAddRoles(guildUser.id, roleId);

        let interactionNum = 0;
        let customId = interact.customId;

        if (currentInter.data.type == ongoingType.custom)
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