import { Console } from 'node:console'

/**
 * A console that does nothing
 */
// eslint-disable-next-line eslint-plugin-import/exports-last
export const NoConsole = new Console(process.stdout)
NoConsole.log = (): void => {
    // do nothing
}
