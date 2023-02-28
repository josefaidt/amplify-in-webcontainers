import type { FileSystemTree } from '@webcontainer/api'

/**
 * @todo refactor to use Vite's `define` to inject the setup file list
 */
const SETUP_FILES = ['patch-amplify-plugins.mjs', '.npmrc']

export function fetchSetupFile(path: string) {
  return fetch(`/setup-files/${path}`).then((response) => response.text())
}

export async function getSetupFiles(): Promise<FileSystemTree> {
  const result: FileSystemTree = {}
  for (const filename of SETUP_FILES) {
    const contents = await fetchSetupFile(filename)
    result[filename] = { file: { contents } }
  }
  return result
}
