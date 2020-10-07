import { Listener } from "discord-akairo";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";

export default class GuildMemberAdd extends Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        })
    }

    async exec(mem: GuildMember) {
        await (<TextChannel>this.client.channels.cache.get('762998569203531797')).send(`멤버 ${mem.user.tag} 나감`)
    }
}