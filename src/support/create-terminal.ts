import { Terminal as XTerm } from 'xterm'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { FitAddon } from 'xterm-addon-fit'

export function createTerminal(node: HTMLElement) {
  const terminal = new XTerm({
    convertEol: true,
  })
  const fitAddon = new FitAddon()
  terminal.loadAddon(new WebLinksAddon())
  terminal.loadAddon(fitAddon)
  terminal.open(node)
  fitAddon.fit()
  return terminal
}
