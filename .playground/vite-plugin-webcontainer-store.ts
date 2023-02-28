import { readdir, writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import type { FileNode, FileSystemTree } from '@webcontainer/api'
import type { Plugin } from 'vite'

export type WebcontainerStoreOptions = {
  storePath?: string
  dependencies?: string[]
  devDependencies?: string[]
}

const defaults = {
  storePath: '.pnpm-store',
  dependencies: [],
  devDependencies: [],
}

// recursively read all files as buffers from a directory
async function readFileSystem(dir: string): Promise<FileSystemTree> {
  const result: FileSystemTree = {}
  const files = await readdir(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      result[file.name] = {
        directory: await readFileSystem(join(dir, file.name)),
      }
    } else {
      result[file.name] = {
        file: {
          contents: (await readFile(join(dir, file.name))).buffer,
        },
      }
    }
  }
  return result
}

/**
 *
 */
export function WebcontainerStorePlugin(
  options?: WebcontainerStoreOptions
): Plugin {
  const { storePath, dependencies, devDependencies } = {
    ...defaults,
    ...options,
  }
  const npmrc = `store-dir=${storePath}`
  return {
    name: 'webcontainer-store',
    async configResolved(config) {
      spawnSync('pnpm', ['--store-dir', storePath, 'install', ...dependencies])
      spawnSync('pnpm', [
        '--store-dir',
        storePath,
        'install',
        '--dev',
        ...devDependencies,
      ])

      const files: FileSystemTree = {
        '.npmrc': {
          file: {
            contents: npmrc,
          },
        },
        '.pnpm-store': {
          directory: {
            ...(await readFileSystem(storePath)),
          },
        },
      }

      config.env.VITE_WEBCONTAINER_STORE_PATH = storePath
      config.define = {
        ...config.define,
        'import.meta.env.VITE_WEBCONTAINER_STORE_FILES': files,
      }
    },
  }
}
