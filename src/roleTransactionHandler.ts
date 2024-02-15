import { Client, Guild, GuildMember, PermissionsBitField, PermissionFlagsBits, ChannelType, OverwriteType, ActionRowBuilder, MessageActionRowComponentBuilder } from "discord.js";
import config from '../configs/config.json' with { type: "json" };
import { createStringMenu } from "./helpers.js";

export default class RoleTransactionHandler {
    private Transactions: roleTransaction[] = [];

    public add(userid: string) {
        this.Transactions.push({ userId: userid, data: { type: transactionPhase.language, customIndex: -1, addRoles: [], removeRoles: [] } });
    }

    public addRole(userid: string, role: string) {
        this.Transactions[this.Transactions.findIndex(x => x.userId == userid)].data.addRoles?.push(role);
    }

    public removeRole(userid: string, role: string) {
        this.Transactions[this.Transactions.findIndex(x => x.userId == userid)].data.removeRoles?.push(role);
    }

    public get(userid: string, remove: boolean = false) {
        let index = this.Transactions.findIndex(x => x.userId == userid);
        let result = this.Transactions[index];

        if (remove)
            this.Transactions.splice(index);

        return result;
    }

    public static async initiate(client: Client, guild: Guild, member: GuildMember) {
        let allows = new PermissionsBitField(PermissionFlagsBits.ViewChannel).add(PermissionFlagsBits.SendMessages);

        let channel = await guild.channels.create({
            name: "Welcome",
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    allow: allows,
                    id: client.user!.id,
                    type: OverwriteType.Member,
                },
                {
                    allow: allows,
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
    
        const options: BotResponse[] = config.Languages.map(x => { return { content: x.ShownAs, role: x.RoleID, emoji: x.Emoji } });
        const select = createStringMenu(`EditRolesMenu Language ${member.id}`, 1, config.Languages.length, options);
    
        const row = new ActionRowBuilder().addComponents(select) as ActionRowBuilder<MessageActionRowComponentBuilder>;
    
        let langMessage = `<@!${member.id}>!\n\n ${config.Languages.map(x => x.languagePrompt).join('\n')}`;
        await channel.send({ content: langMessage, components: [row] });
    }
}