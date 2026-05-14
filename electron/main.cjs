const meshService =
  require('../backend/services/meshService.cjs');

const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain,
  dialog
} = require('electron');

const axios = require('axios');
const si = require('systeminformation');
const { exec } = require('child_process');
const os = require('os');
const path = require('path');

const fs = require('fs');

const remindersPath =
  path.join(
    __dirname,
    '../reminders.json'
  );

const telegramBot =
  require('../telegramBot');

const {
  autoUpdater
} = require('electron-updater');

app.commandLine.appendSwitch(
  'ignore-certificate-errors'
);

let mainWindow;



/* =========================
   AUTO UPDATE
========================= */

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on(
  'checking-for-update',
  () => {
    console.log('Checking updates...');
  }
);

autoUpdater.on(
  'update-available',
  () => {
    console.log('Update available');
  }
);

autoUpdater.on(
  'update-not-available',
  () => {
    console.log('No updates');
  }
);

autoUpdater.on(
  'download-progress',
  (progress) => {

    console.log(
      `Downloading: ${Math.round(progress.percent)}%`
    );

  }
);

autoUpdater.on(
  'update-downloaded',
  () => {

    dialog.showMessageBox({
      type: 'info',
      title: 'Обновление',
      message:
        'Новая версия Diona загружена. Приложение перезапустится.'
    });

    autoUpdater.quitAndInstall();

  }
);

autoUpdater.on(
  'error',
  (err) => {
    console.log(err);
  }
);


/* =========================
   IPC
========================= */

ipcMain.handle(
  'get-statistics',
  async () => {

    return telegramBot.statistics;

  }
);

ipcMain.handle(

  'clear-room-statistics',

  async (_, room) => {

    try {

      if (
        telegramBot.statistics?.[room]
      ) {

        delete telegramBot.statistics[
          room
        ];

      }

      return true;

    } catch (err) {

      console.log(err);

      return false;

    }

  }

);

ipcMain.handle(
  'get-notifications',
  async () => {

    return telegramBot.notifications;

  }
);

ipcMain.handle(
  'delete-notification',
  async (_, id) => {

    telegramBot.deleteNotification(
      id
    );

    return true;

  }
);

ipcMain.handle(

  'delete-stat-message',

  async (_, data) => {

    try {

      const {
        room,
        index
      } = data;

      if (
        telegramBot.statistics?.[room]
      ) {

        telegramBot.statistics[
          room
        ].splice(
          index,
          1
        );

      }

      return true;

    } catch (err) {

      console.log(err);

      return false;

    }

  }

);

ipcMain.handle(
  'clear-archive',
  async () => {

    telegramBot.clearArchive();

    return true;

  }
);

ipcMain.handle(
  'archive-statistics',
  async () => {

    telegramBot.archiveStatistics();

    return true;

  }
);

ipcMain.handle(
  'get-archive',
  async () => {

    return telegramBot.archive;

  }
);

ipcMain.handle(
  'remind-all',
  async () => {

    await telegramBot.remindAll();

    return true;

  }
);

/* =========================
   REMINDERS
========================= */

ipcMain.handle(

  'get-reminders',

  async () => {

    try {

      if (
        !fs.existsSync(
          remindersPath
        )
      ) {

        fs.writeFileSync(

          remindersPath,

          JSON.stringify(
            [
              '14:45',
              '17:45',
              '20:45',
              '06:45'
            ],
            null,
            2
          )

        );

      }

      return JSON.parse(

        fs.readFileSync(
          remindersPath,
          'utf8'
        )

      );

    } catch (err) {

      console.log(err);

      return [];

    }

  }

);

ipcMain.handle(

  'save-reminders',

  async (_, reminders) => {

    try {

      fs.writeFileSync(

        remindersPath,

        JSON.stringify(
          reminders,
          null,
          2
        )

      );

      return true;

    } catch (err) {

      console.log(err);

      return false;

    }

  }

);


/* =========================
   SHIFT CONTROL
========================= */

ipcMain.handle(

  'start-shift',

  async () => {

    /*
      CHROME
    */

    exec(
      'start chrome',
      { shell: true }
    );

    /*
      TELEGRAM
    */

    exec(

      `"${process.env.APPDATA}\\Telegram Desktop\\Telegram.exe"`,

      () => {}

    );

    /*
      PCLOUD
    */

    exec(

      `"C:\\Program Files\\pCloud Drive\\pcloud.exe"`,

      (err) => {

        if (err) {

          console.log(
            'pCloud start error:',
            err.message
          );

        }

      }

    );

    return true;

  }

);

ipcMain.handle(

  'end-shift',

  async () => {

    exec(
      'taskkill /IM chrome.exe /F',
      () => {}
    );

    exec(
      'taskkill /IM Telegram.exe /F',
      () => {}
    );

    exec(
      'taskkill /IM pCloud.exe /F',
      () => {}
    );

    exec(
      'taskkill /IM pcloud.exe /F',
      () => {}
    );

    return true;

  }

);


/* =========================
   SYSTEM METRICS
========================= */

async function getSystemMetrics() {

  const cpu =
    await si.currentLoad();

  const mem =
    await si.mem();

  const network =
    await si.networkStats();

  return {

    cpu:
      Math.round(cpu.currentLoad),

    ram:
      (
        mem.active /
        1024 /
        1024 /
        1024
      ).toFixed(1),

    uptime:
      Math.floor(
        os.uptime() / 3600
      ),

    network:
      Math.round(
        network[0]?.rx_sec /
        1024 /
        1024 || 0
      )

  };
}

ipcMain.handle(
  'get-system-metrics',
  async () => {

    return await getSystemMetrics();

  }
);


/* =========================
   WINDOW
========================= */

function createWindow() {

  mainWindow =
    new BrowserWindow({

      width: 1700,
      height: 980,

      icon: path.join(
        __dirname,
        '../assets/icons/win/icon.ico'
      ),

      minWidth: 1280,
      minHeight: 720,

      backgroundColor:
        '#07030d',

      autoHideMenuBar: true,

      frame: false,

      title:
        'Diona Control Panel',

      webPreferences: {

        nodeIntegration: true,

        contextIsolation: false

      }

    });

  const startUrl =
    app.isPackaged
      ? `file://${path.join(__dirname, '../dist/index.html')}`
      : 'http://localhost:5173';

  mainWindow.loadURL(startUrl);

  if (!app.isPackaged && false) {
  mainWindow.webContents.openDevTools();
}
}


/* =========================
   DEVICES
========================= */

ipcMain.handle(
  'get-devices',
  async () => {

    return [

      {
        id: 1,
        name: 'ADMIN-PC',
        ip: '10.101.10.232',
        os: 'Windows 11 Pro',
        group: 'Infrastructure',
        status: 'online'
      },

      {
        id: 2,
        name: 'STUDIO-01',
        ip: '10.101.10.45',
        os: 'Windows 10',
        group: 'Models',
        status: 'online'
      },

      {
        id: 3,
        name: 'STREAM-PC',
        ip: '10.101.10.77',
        os: 'Windows 11',
        group: 'Streaming',
        status: 'offline'
      }

    ];

  }
);


/* =========================
   NETWORK SCAN
========================= */

ipcMain.handle(
  'scan-network',
  async () => {

    return [];

  }
);


/* =========================
   PROCESSES
========================= */

ipcMain.handle(
  'get-processes',
  async () => {

    const processes =
      await si.processes();

    return processes.list
      .slice(0, 25)
      .map((proc) => ({

        name: proc.name,

        pid: proc.pid,

        cpu:
          proc.cpu.toFixed(1),

        memory:
          Math.round(
            proc.memVsz /
            1024 /
            1024
          )

      }));

  }
);


/* =========================
   USERNAME CHECKER
========================= */

async function checkChaturbate(
  username
) {

  try {

    const res =
      await axios.get(

        `https://chaturbate.com/${username}/`,

        {
          validateStatus:
            () => true
        }

      );

    return res.status === 404;

  } catch {

    return false;

  }

}

async function checkStripchat(
  username
) {

  try {

    const res =
      await axios.get(

        `https://stripchat.com/${username}`,

        {
          validateStatus:
            () => true
        }

      );

    return res.status === 404;

  } catch {

    return false;

  }

}

async function checkCamsoda(
  username
) {

  try {

    const res =
      await axios.get(

        `https://www.camsoda.com/${username}`,

        {
          validateStatus:
            () => true
        }

      );

    return res.status === 404;

  } catch {

    return false;

  }

}

ipcMain.handle(

  'check-username',

  async (_, username) => {

  console.log(
    'IPC CHECK:',
    username
  );

    

    const [

      cb,
      sc,
      cs

    ] = await Promise.all([

      checkChaturbate(
        username
      ),

      checkStripchat(
        username
      ),

      checkCamsoda(
        username
      )

    ]);

    return {

      username,

      available:
        cb || sc || cs,

      sites: {

        chaturbate: cb,

        stripchat: sc,

        camsoda: cs

      }

    };

  }

);


/* =========================
   TERMINAL
========================= */

ipcMain.handle(
  'terminal-command',
  async (_, command) => {

    return new Promise((resolve) => {

      exec(
        command,

        {
          timeout: 10000
        },

        (
          error,
          stdout,
          stderr
        ) => {

          if (error) {

            resolve(
              stderr || error.message
            );

            return;
          }

          resolve(stdout || stderr);

        }
      );

    });

  }
);

/* =========================
   MESH VIEW
========================= */



/* =========================
   WINDOW BUTTONS
========================= */

ipcMain.on(
  'window-minimize',
  () => {
    mainWindow.minimize();
  }
);

ipcMain.on(
  'window-maximize',
  () => {

    if (
      mainWindow.isMaximized()
    ) {

      mainWindow.unmaximize();

    } else {

      mainWindow.maximize();

    }

  }
);

ipcMain.on(
  'window-close',
  () => {
    mainWindow.close();
  }
);


/* =========================
   APP START
========================= */

ipcMain.on(
  'open-mesh-window',
  () => {

    const meshWindow =
      new BrowserWindow({

        width: 1600,
        height: 1000,

        autoHideMenuBar: true,

        backgroundColor:
          '#05010a',

        title:
          'MeshCentral',

        webPreferences: {

          contextIsolation: true,
          nodeIntegration: false

        }

      });

    meshWindow.loadURL(
      'https://10.101.10.232/'
    );

    meshWindow.maximize();

  }
);


app.whenReady().then(() => {

  createWindow();

  setTimeout(() => {

    autoUpdater
      .checkForUpdatesAndNotify();

  }, 5000);

});

app.on(
  'window-all-closed',
  () => {

    if (
      process.platform !== 'darwin'
    ) {

      app.quit();

    }

  }
);