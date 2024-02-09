export default class InteractionHandler {
    public Interactions: ongoing[] = [];

    add = (userid: string) =>
        this.Interactions.push({ userId: userid, data: { type: ongoingType.language, customIndex: -1, addRoles: [] } });

    addRole = (userid: string, role: string) =>
        this.Interactions[this.Interactions.findIndex(x => x.userId == userid)].data.addRoles?.push(role);

    removeRole = (userid: string, role: string) =>
        this.Interactions[this.Interactions.findIndex(x => x.userId == userid)].data.removeRoles?.push(role);

    get = (userid: string, remove: boolean = false) => {
        let index = this.Interactions.findIndex(x => x.userId == userid);
        let result = this.Interactions[index];
        
        if (remove)
            this.Interactions.splice(index);

        return result;
    }
}