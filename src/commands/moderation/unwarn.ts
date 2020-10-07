import { Command } from "discord-akairo";
import { User } from "discord.js";
import { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { MessageReaction } from "discord.js";
import { GuildMember } from "discord.js";
import { Message } from "discord.js";
import {v4} from 'uuid'

export default class Reload extends Command {
    constructor() {
        super('경고취소', {
            aliases: ['경고취소'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'id',
                    type: 'string',
                    prompt: false
                }
            ]
        })
    }

    async exec(msg: Message, {id}: {id: string}) {
        const warn = (await this.client.db('warns').where('id',id))[0]
        if (!warn) return msg.util?.send('경고가 없는데요')
        if (!this.client.users.cache.get(warn.user)) return msg.util?.send('그사람 서버 나감')
        const m = await msg.util?.send(msg.embed().setTitle('경고 해제').setDescription(`멤버 ${this.client.users.cache.get(warn.user)?.tag}의 경고를 취소할까요?\n사유: ${warn.reason}`))
        await Promise.all(['⭕','❌'].map(r=>m?.react(r)))
        const reactions = await m?.awaitReactions((r: MessageReaction,u:User)=>u.id === msg.author.id && ['⭕','❌'].includes(r.emoji.name), {
            max: 1,
            time: 3000
        })
        if (!reactions) return msg.util?.send(msg.embed().setDescription('취소했어요.'))
        if (reactions.first()?.emoji.name === '❌') msg.embed().setDescription('취소했어요.')
        if (reactions.first()?.emoji.name === '⭕') {
            await this.client.db('warns').delete().where('id', id)
            await msg.util?.send('경고 취소가 완료되었습니다.')
        }
    }
}