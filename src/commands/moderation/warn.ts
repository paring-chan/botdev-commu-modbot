import { Command } from "discord-akairo";
import { User } from "discord.js";
import { TextChannel } from "discord.js";
import { MessageReaction } from "discord.js";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";
import {v4} from 'uuid'

export default class Reload extends Command {
    constructor() {
        super('경고', {
            aliases: ['경고'],
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
        const m = await msg.util?.send(msg.embed().setTitle('경고').setDescription(`멤버 ${member}에게 경고를 지급할까요?`))
        await Promise.all(['⭕','❌'].map(r=>m?.react(r)))
        const reactions = await m?.awaitReactions((r: MessageReaction,u:User)=>u.id === msg.author.id && ['⭕','❌'].includes(r.emoji.name), {
            max: 1,
            time: 3000
        })
        if (!reactions) return msg.util?.send(msg.embed().setDescription('경고 지급을 취소했어요.'))
        if (reactions.first()?.emoji.name === '❌') msg.embed().setDescription('경고 지급을 취소했어요.')
        if (reactions.first()?.emoji.name === '⭕') {
            const id = v4()
            await this.client.db('warns').insert({
                id,
                user: member.id,
                reason
            })
            const len = (await this.client.db('warns').where('user', member.id)).length
            await msg.util?.send(msg.embed().setTitle('경고').setDescription(`유저:${member}\n사유:${reason}\nID:${id}\n경고 스택: ${len}/5`))
            if (len >= 5) {
                await member.ban()
                await this.client.db('warns').delete().where('user', member.id)
                await (<TextChannel>this.client.channels.cache.get('761875050784620556')).send(msg.embed().setDescription(`차단\n멤버: ${member.user.tag}\n\n이 멤버는 경고를 5번 받아 자동으로 서버에서 차단되었습니다.`))
            }
        }
    }
}