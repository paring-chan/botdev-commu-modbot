import { Command } from "discord-akairo";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('밴', {
            aliases: ['밴'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: false
                },
                {
                    id: 'reason',
                    type: 'string',
                    default: '사유 지정되지 않음',
                    match: 'rest'
                }
            ]
        })
    }

    async exec(msg: Message, {member, reason}: {member: GuildMember, reason: string}) {
        await member.ban({
            reason: reason
        })
        await msg.util?.send(msg.embed().setTitle('차단').addField('멤버', member.user.tag).addField('사유',reason))
    }
}