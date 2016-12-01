const { app, BrowserWindow, ipcMain } = require('electron')
const finished = require('tap-finished')

let win

function createWindow () {
  win = new BrowserWindow({ show: false })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    win = null
  })

  let stream = finished(function(results) {
    win.send('close')
    process.exit(results.ok ? 0 : 1)
  })

  ipcMain.on('log', function(e, data) {
    if (data) {
      console.log(data)
      stream.write(data + '\n')
    }
  })
}

// enable Object.entries
app.commandLine.appendSwitch('js-flags', '--harmony-object-values-entries')

app.on('ready', createWindow)