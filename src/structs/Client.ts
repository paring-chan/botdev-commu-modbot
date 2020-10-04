import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import path from "path";
import config from '../../config.json'

export default class Client extends AkairoClient {
    listenerHandler: ListenerHandler

    commandHandler: CommandHandler

    constructor() {
        super({
            disableMentions: 'everyone',
            ownerID: config.owners,
            presence: {
                status: 'idle',
                activity: {
                    name: '야 바나나 일해',
                    type: 'WATCHING'
                }
            }
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.resolve(path.join(__dirname, '..', 'listeners')),
            loadFilter: (path) => path.endsWith('.ts') || path.endsWith('.js')
        }).on('load', (listener) => console.log(`Load listener: ${listener.id}`))

        this.commandHandler = new CommandHandler(this, {
            directory: path.resolve(path.join(__dirname, '..', 'commands')),
            loadFilter: (path) => path.endsWith('.ts') || path.endsWith('.js'),
            prefix: '!',
            commandUtil: true
        }).on('load', (cmd)=>console.log(`Load command: ${cmd.id}`))

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        })
        this.commandHandler.loadAll()
        this.listenerHandler.loadAll()
    }
}