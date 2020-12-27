import { execSync } from 'child_process'
import chalk from 'chalk'
import packageJson from './package.json'
import path from 'path'
import fs from 'fs'

const exec = (command: string) => {
  console.log(chalk.gray(command))
  execSync(command, { stdio: 'inherit' })
}

const cleanupPackageJson = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { devDependencies, scripts, ...rest } = packageJson

  const json = JSON.stringify(
    { ...rest, typings: './index.d.ts', main: './index.js' },
    undefined,
    '  '
  )

  fs.writeFileSync(path.join(__dirname, './dist/package.json'), json)
}

console.log(chalk.green('Building "postcss-typescript-d-ts"'))
exec('rm -rf ./dist')
exec(`yarn tsc --project ./tsconfig.prod.json`)
exec(`cp ../../README.md ./dist/README.md`)
console.log(chalk.gray('Cleanup package.json'))
cleanupPackageJson()
console.log(chalk.green('Done: Building "postcss-typescript-d-ts"'))
