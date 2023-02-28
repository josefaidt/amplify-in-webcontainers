import type { WebContainer } from '@webcontainer/api'
import type { Terminal } from 'xterm'

export async function startShell(
  webcontainer: WebContainer,
  terminal: Terminal
) {
  const shellProcess = await webcontainer.spawn('jsh')
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data)
      },
    })
  )

  const input = shellProcess.input.getWriter()
  terminal.onData((data) => {
    input.write(data)
  })

  return shellProcess
}
