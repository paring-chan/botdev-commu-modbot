import { createCanvas } from "canvas";
import { Command } from "discord-akairo";
import { MessageAttachment } from "discord.js";
import { Message } from "discord.js";

export default class Reload extends Command {
    constructor() {
        super('인증', {
            aliases: ['인증'],
        })
    }

    async exec(msg: Message) {
        const randomText = () => {
            const arr = new Array(6).fill([0,1,2,3,4,5,6,7,8,9].map(r=>`${r}`))
            return arr.map(r=>r[Math.floor(Math.random() * r.length)]).join('')
        }

        const fontBase = 200
        const fontSize = 35

        const relativeFont = (width: number) => {
            const ratio = fontSize / fontBase
            const size = width * ratio
            return `${size}px serif`
        }

        const arbitraryRandom = (min: number, max: number) => Math.random() * (max - min) + min

        const randomRotation = (degrees = 15) => (arbitraryRandom(-degrees, degrees) * Math.PI) / 180

        const configureText = (ctx: any, width: number, height: number) => {
            ctx.font = relativeFont(width);
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            const text = randomText();
            ctx.fillStyle = "#000"
            ctx.fillText(text, width / 2, height / 2);
            return text;
        };

        const generate = (width: number, height: number) => {
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext("2d");
            ctx.rotate(randomRotation());

            const text = configureText(ctx, width, height);
            return {
                image: canvas.toBuffer(),
                text: text
            };
        };

        const captcha = generate(200,100)

        const attachment = new MessageAttachment(captcha.image)

        await msg.reply('아래 사진의 텍스트를 입력해주세요. 제한시간은 30초입니다.',attachment)

        const collector = msg.channel.createMessageCollector(m => m.author.id === msg.author.id, {
            time: 30000,
            max: 1
        })

        collector.on('collect',async m => {
            if (m.content !== captcha.text) {
                return collector.stop('wrong')
            } else {
                await msg.member!.roles.add('761871608918704139')
                await msg.reply('인증 성공')
            }
        })

        collector.on('end', (_, reason) => {
            if ('time' === reason) return msg.reply('시간 초과 되었습니다.')
            if ('wrong' === reason) return msg.reply('문자가 틀렸습니다. 명령어를 다시 입력해 재시도 해주세요.')
        })
    }
}