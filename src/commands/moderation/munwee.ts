import { Command } from "discord-akairo";
import { MessageReaction } from "discord.js";
import { User } from "discord.js";
import { TextChannel } from "discord.js";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";

export default class Munwee extends Command {
    constructor() {
        super('문의', {
            aliases: ['문의'],
            args: [
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    prompt: {
                        start: '내용을 입력하세요'
                    }
                }
            ]
        })
    }

    async exec(msg: Message, {reason}: {reason: string}) {
        const c = (<TextChannel>this.client.channels.cache.get('762193733160009748'))
        const embed = msg.embed().setTitle('문의').addField('멤버', msg.member,true).setDescription('```md\n'+reason+'```')
        const m = await msg.util?.send('이 내용으로 신고를 접수할까요?', embed)
        await Promise.all(['⭕','❌'].map(r=>m?.react(r)))
        const reactions = await m?.awaitReactions((r: MessageReaction,u:User)=>u.id === msg.author.id && ['⭕','❌'].includes(r.emoji.name), {
            max: 1,
            time: 3000
        })
        if (!reactions) return msg.util?.send(msg.embed().setDescription('문의 접수를 취소했어요.'))
        if (reactions.first()?.emoji.name === '❌') msg.embed().setDescription('문의 접수를 취소했어요.')
        if (reactions.first()?.emoji.name === '⭕') {
            await c.send(embed)
            await msg.util?.send('문의 접수가 완료되었어요.')
        }
    }
}