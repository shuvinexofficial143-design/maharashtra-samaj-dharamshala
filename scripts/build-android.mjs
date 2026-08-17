import { copyFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const androidRoot = join(projectRoot, 'android')
const javaHomes = [
  process.env.JAVA_HOME,
  process.platform === 'win32' ? 'C:\\Program Files\\Android\\Android Studio\\jbr' : undefined,
].filter(Boolean)

const javaHome = javaHomes.find(candidate => existsSync(join(candidate, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')))
if (!javaHome) {
  throw new Error('JDK 21 was not found. Set JAVA_HOME to Android Studio\'s bundled jbr directory.')
}

const environment = {
  ...process.env,
  JAVA_HOME: javaHome,
  PATH: `${join(javaHome, 'bin')}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH ?? ''}`,
}

const isWindows = process.platform === 'win32'
const command = isWindows ? (process.env.ComSpec ?? 'C:\\Windows\\System32\\cmd.exe') : './gradlew'
const args = isWindows ? ['/d', '/s', '/c', 'gradlew.bat assembleDebug'] : ['assembleDebug']
const result = spawnSync(command, args, {
  cwd: androidRoot,
  env: environment,
  stdio: 'inherit',
})

if (result.status !== 0) {
  throw new Error(`Android Gradle build failed with exit code ${result.status ?? 'unknown'}.`)
}

const sourceApk = join(androidRoot, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
const artifactDirectory = join(projectRoot, 'artifacts')
const artifactApk = join(artifactDirectory, 'Maharashtra-Samaj-Dharamshala-Demo-v1.0.0.apk')
await mkdir(artifactDirectory, { recursive: true })
await copyFile(sourceApk, artifactApk)
const apk = await stat(artifactApk)
console.log(`Copied debug APK (${(apk.size / 1024 / 1024).toFixed(2)} MiB) to ${artifactApk}`)
