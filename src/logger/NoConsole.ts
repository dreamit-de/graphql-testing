import { Console } from 'node:console'

export const NoConsole = new Console(process.stdout)
NoConsole.log = (): void => {
    // do nothing
}
