import { ComponentType, GuildMember, Interaction, InteractionType, StringSelectMenuInteraction } from "discord.js";

export default class GiveRoleMenu implements InteractionInterface {
    public interactionType = InteractionType.MessageComponent;
    public componentTeype = ComponentType.Button;

    public async action(interact: StringSelectMenuInteraction) {
        if (!interact.customId.includes(interact.user.id) || !interact.guild)
            return;

        let guildUser = await interact.guild.members.fetch(interact.user);

        for (const roleId of interact.values)
            await guildUser.roles.add(roleId);

        await interact.update(await this.nextInteraction(interact.customId, guildUser));
    }

    private async nextInteraction(customId: string, guildUser: GuildMember) {
        let interactionNum = 0;
    
        if (!customId.includes("Language"))
            interactionNum = parseInt(customId.split(' ')[0]);
    
        let languageConfig = await getLanguageConfig(guildUser);
    
        let interact = languageConfig.interactions.at(interactionNum);
    
        if (interact) {
            const select = new StringSelectMenuBuilder()
                .setCustomId(`${++interactionNum} ${guildUser.id}`)
                .setPlaceholder(languageConfig.selectionPlaceHolder)
                .setMinValues(0)
                .setMaxValues(interact.responses.length)
                .addOptions(interact.responses.map(x => {
                    let b = new StringSelectMenuOptionBuilder()
                        .setLabel(x.content)
                        .setDescription(`<@${x.role}>`)
                        .setValue(x.role);
                    if (x.emoji)
                        b.setEmoji(x.emoji);
                    return b;
                }));
    
            const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    
            return { content: interact.prompt, components: [row] };
        }
    
        const confirm = new ButtonBuilder()
            .setCustomId('accept')
            .setLabel('✅')
            .setStyle(ButtonStyle.Success);
    
        const cancel = new ButtonBuilder()
            .setCustomId('reject')
            .setLabel('❌')
            .setStyle(ButtonStyle.Danger);
    
        const row = new ActionRowBuilder()
            .addComponents(confirm)
            .addComponents(cancel) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    
        return { content: languageConfig.rules.join('\n'), components: [row] };
    }
}