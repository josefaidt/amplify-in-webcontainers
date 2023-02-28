import type { Terminal } from 'xterm'
import type { WebContainer } from '@webcontainer/api'

export type Context = {
  webcontainer: WebContainer
  terminal: Terminal
}

export async function run(context: Context, command: string) {
  const { webcontainer, terminal } = context
  const [commandName, ...args] = command.split(' ')
  const spawnProcess = await webcontainer.spawn(commandName, args)
  spawnProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    })
  )
  // wait for the process to exit
  return spawnProcess.exit
}
