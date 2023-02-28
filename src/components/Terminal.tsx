import { useRef, useEffect, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { useWebContainer } from '../support/WebContainer'
import { startup } from '../support/startup'
import type { PropsWithChildren } from 'react'

export type TerminalProps = PropsWithChildren<{}>

function createTerminal(node: HTMLElement) {
  const terminal = new XTerm({
    convertEol: true,
  })
  terminal.open(node)
  return terminal
}

export function Terminal(props: TerminalProps) {
  const terminal = useRef<XTerm>()
  const ref = useRef<HTMLDivElement | null>(null)
  const webContainer = useWebContainer()

  useEffect(() => {
    // mount terminal
    if (ref.current?.childElementCount === 0) {
      terminal.current = createTerminal(ref.current)
    }
    // unmount terminal
    return () => {
      terminal.current?.dispose()
    }
  }, [ref])

  useEffect(() => {
    // run webcontainer setup process
    if (terminal.current && webContainer) {
      startup(webContainer, terminal.current).catch(console.error)
    }
  }, [terminal, webContainer])

  return <div id="terminal" ref={ref}></div>
}

export default Terminal
