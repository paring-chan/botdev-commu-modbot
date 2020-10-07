import { Command } from "discord-akairo";
import { MessageReaction } from "discord.js";
import { User } from "discord.js";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('신고', {
            aliases: ['신고'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: false
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    prompt: false
                }
            ]
        })
    }

    async exec(msg: Message, {member, reason}: {member: GuildMember, reason: string}) {
        const c = (<TextChannel>this.client.channels.cache.get('762307209383116820'))
        const embed = msg.embed().setTitle('신고 접수').addField('멤버', member,true).addField('신고한 멤버',msg.author,true).addField('사유', '```md\n'+reason+'```')
        const m = await msg.util?.send('이 내용으로 신고를 접수할까요?', embed)
        await Promise.all(['⭕','❌'].map(r=>m?.react(r)))
        const reactions = await m?.awaitReactions((r: MessageReaction,u:User)=>u.id === msg.author.id && ['⭕','❌'].includes(r.emoji.name), {
            max: 1,
            time: 3000
        })
        if (!reactions) return msg.util?.send(msg.embed().setDescription('신고를 취소했어요.'))
        if (reactions.first()?.emoji.name === '❌') msg.embed().setDescription('신고를 취소했어요.')
        if (reactions.first()?.emoji.name === '⭕') {
            await c.send(embed)
            await msg.util?.send('신고 접수가 완료되었어요.')
        }
    }
}