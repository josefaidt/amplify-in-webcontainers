import { run } from './run'
import { getSetupFiles } from './get-setup-files'
import type { Context } from './run'
import type { Terminal } from 'xterm'
import type { WebContainer } from '@webcontainer/api'

export async function startup(webcontainer: WebContainer, terminal: Terminal) {
  const context: Context = { webcontainer, terminal }
  // Create a new project
  await run(context, 'npm init')
  // Install dependencies
  await run(context, 'npm install --save-dev @aws-amplify/cli-internal')
  // alias Amplify to relative node_modules path
  await run(context, 'alias amplify=node_modules/.bin/amplify')
  // run `amplify version` to "initialize" Amplify (create .amplify dir)
  await run(context, 'amplify version')

  // mount files and initialize amplify
  const filesystem = await getSetupFiles()
  await webcontainer.mount(filesystem)
  // run patch script
  await run(context, 'node patch-amplify-plugins.mjs')

  // success message
  await run(context, 'amplify version')
  terminal.writeln(
    `\n\nFinished! You\'re running Amplify CLI in the browser!\n`
  )
}
