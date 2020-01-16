module.exports = function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B2J\x1B3J\x1B[H'
  )
}