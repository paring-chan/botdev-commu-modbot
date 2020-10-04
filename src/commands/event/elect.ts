import { Command } from "discord-akairo";
import { User } from "discord.js";
import { Collection } from "discord.js";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('추첨', {
            aliases: ['추첨'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    type: 'message',
                    id: 'message',
                    prompt: {
                        start: '메시지 id 입력하삼'
                    }
                }
            ]
        })
    }

    async exec(msg: Message, {message}: {message: Message}) {
        if (!message) return msg.util?.reply('메시지가 없는데요')
        const reactions = message.reactions.cache
        if (reactions.size === 0) return msg.util?.send('반응이 없습니다')
        const users: User[] = []
        for (let reaction of reactions.values()) {
            const us = await reaction.users.fetch()
            us.forEach(u=>{
                if (users.find(r=>r.id === u.id)) return
                users.push(u)
            })
        }
        const uColl = new Collection<string,User>()
        users.forEach(user => uColl.set(user.id, user))
        const u = uColl.random()
        if (u) {
            await msg.util?.send(msg.embed().setTitle('추첨').setDescription(`${u}님이 당첨되셨습니다. 축하드립니다!`))
        } else {
            await msg.util?.send('유저가 없어요(?)')
        }
    }
}