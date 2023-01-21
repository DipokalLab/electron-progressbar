const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const ProgressBar = require("../source/index.js")

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration:true,
        contextIsolation : false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function loadProgress() {
    let percentage = 0
    let progressBar = new ProgressBar({
        indeterminate: false,
        text: 'main title',
        detail: 'progress...'
    });
  
    setInterval(() => {
        if(!progressBar.isCompleted()){
            percentage += 0.45
            progressBar.value = percentage;
        }
    }, 1000)

    progressBar
        .on('completed', function() {
            progressBar.detail =  'completed';
        })
        .on('aborted', function(value) {
            //console.info(`calcel... ${value}`);
        })
        .on('progress', function(value) {
            progressBar.detail = `100% / ${value}% ...`;
        });
}


ipcMain.on('PROGRESS_BAR', async (evt) => {
    loadProgress()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})