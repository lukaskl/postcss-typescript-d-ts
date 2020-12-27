import { promises as fs } from 'fs'
import path from 'path'
import parser from 'postcss-selector-parser'

export interface WriteFileProps {
  paths: {
    cssFile: string
    dtsFile: string
  }
  content: string
  parts: {
    header?: string
    classes: string[]
    footer?: string
  }
}

const canAccess = async (directoryPath: string) => {
  try {
    await fs.access(directoryPath)
    return true
  } catch {
    return false
  }
}

export const defaultWriteFile = async ({ paths, content }: WriteFileProps) => {
  const directoryPath = path.dirname(paths.dtsFile)

  if (!(await canAccess(directoryPath))) {
    fs.mkdir(directoryPath, { recursive: true })
  }

  await fs.writeFile(paths.dtsFile, content)
}

export const getClasses = async (selector: string): Promise<Set<string>> => {
  const classes = new Set<string>()
  await parser((selectors) => {
    selectors.walk((selector) => {
      if (selector.type === 'class') {
        classes.add(selector.value)
      }
    })
  }).process(selector)

  return classes
}
