import { Console } from 'node:console'

/**
 * A console that does nothing
 */
export const NoConsole = new Console(process.stdout)
NoConsole.log = (): void => {
    // do nothing
}
