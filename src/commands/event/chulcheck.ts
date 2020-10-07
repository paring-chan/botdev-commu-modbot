import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('출첵', {
            aliases: ['출첵']
        })
    }

    async exec(msg: Message) {
        const time = require('moment')(new Date()).format('YYYY-MM-DD')
        if ((await this.client.db('chulchecks').where({user: msg.author.id,at:time}))[0]) return msg.util?.send('오늘 출첵 했잖아요')
        const now = new Date()
        await this.client.db('chulchecks').insert({user: msg.author.id, at: require('moment')(now).format('YYYY-MM-DD')})
        await msg.util?.send(`출석 완료, 출석 처리된 시각: ${now.toString()}`)
    }
}