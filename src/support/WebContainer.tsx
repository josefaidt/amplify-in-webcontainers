import { createContext, useContext, useEffect, useState } from 'react'
import { WebContainer } from '@webcontainer/api'
import type { PropsWithChildren } from 'react'

export const WebContainerContext = createContext<WebContainer | null>(null)

export function WebContainerProvider({ children }: PropsWithChildren<{}>) {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null)

  async function boot() {
    console.debug('booting WebContainer')
    console.time('WebContainer.boot')
    const webContainer = await WebContainer.boot()
    console.timeEnd('WebContainer.boot')
    setWebContainer(webContainer)
  }

  useEffect(() => {
    console.debug('mounting WebContainerProvider', webContainer)
    if (!webContainer) boot().catch(console.error)
    return () => {
      console.debug('unmounting WebContainerProvider', webContainer)
      webContainer?.teardown()
    }
  }, [])

  return (
    <WebContainerContext.Provider value={webContainer}>
      {children}
    </WebContainerContext.Provider>
  )
}

export function useWebContainer() {
  const webContainer = useContext(WebContainerContext)
  if (webContainer === undefined) {
    throw new Error(
      'useWebContainer must be used within a WebContainerProvider'
    )
  }
  return webContainer
}
