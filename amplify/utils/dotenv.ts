import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..', '..')
const localDotEnv = path.join(root, '.env')

if (!fs.existsSync(localDotEnv)) {
  fs.writeFileSync(localDotEnv, '')
}

export const getDotenvValue = (key: string): string | undefined => {
  const currentDotEnv = fs.readFileSync(localDotEnv, 'utf8')
  const regex = new RegExp(`${key}=(.*)`)
  const match = currentDotEnv.match(regex)
  return match ? match[1] : undefined
}

export const setDotenvValue = (key: string, value: string): void => {
  const currentDotEnv = fs.readFileSync(localDotEnv, 'utf8')
  const regex = new RegExp(`${key}=(.*)`)
  const match = currentDotEnv.match(regex)
  if (match) {
    const newDotEnv = currentDotEnv.replace(regex, `${key}=${value}`)
    fs.writeFileSync(localDotEnv, newDotEnv)
  } else {
    fs.appendFileSync(localDotEnv, `${key}=${value}\n`)
  }
}
