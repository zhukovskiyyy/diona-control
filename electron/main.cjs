const meshService =
  require('../backend/services/meshService.cjs');

const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain
} = require('electron');

const axios = require('axios');
const si = require('systeminformation');
const { exec } = require('child_process');
const os = require('os');
const https = require('https');
const path = require('path');
const fs = require('fs');
const telegramBot =
  require('../telegramBot')
const {
  autoUpdater
} = require('electron-updater');
app.commandLine.appendSwitch('ignore-certificate-errors');

let mainWindow;
let meshView;
let meshAttached = false;

ipcMain.on(
  'attach-mesh',
  () => {
    if (meshAttached) return;

    mainWindow.setBrowserView(
      meshView
    );

    const bounds =
      mainWindow.getBounds();

    meshView.setBounds({
      x: 320,
      y: 160,
      width:
        bounds.width - 350,
      height:
        bounds.height - 190
    });

    meshAttached = true;
  }
);

ipcMain.handle(
  'get-statistics',
  async () => {

    return telegramBot.statistics;

  }
);

ipcMain.handle(

  'clear-room-statistics',

  async (_, room) => {

    telegramBot.clearRoomStatistics(
      room
    );

    return true;

  }

);

ipcMain.handle(

  'get-notifications',

  async () => {

    return telegramBot.notifications;

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
  'remind-all',
  async () => {

    await telegramBot.remindAll();

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
  'start-shift',
  async () => {

    exec(
      'start chrome',
      { shell: true }
    );

    exec(
      `"${process.env.APPDATA}\\Telegram Desktop\\Telegram.exe"`,
      () => {}
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

    return true;
  }
);

ipcMain.on(
  'detach-mesh',
  () => {
    if (!meshAttached) return;

    mainWindow.removeBrowserView(
      meshView
    );

    meshAttached = false;
  }
);

async function getSystemMetrics() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const network = await si.networkStats();

  return {
    cpu: Math.round(cpu.currentLoad),

    ram: (
      (mem.active / 1024 / 1024 / 1024)
    ).toFixed(1),

    uptime: Math.floor(
      require('os').uptime() / 3600
    ),

    network: Math.round(
      network[0]?.rx_sec / 1024 / 1024 || 0
    )
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1700,
    height: 980,
    backgroundColor: '#07030d',
    autoHideMenuBar: true,
    frame: false,
    title: 'Diona Control Panel',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL('http://localhost:5173');

  createMeshView();

  mainWindow.on('resize', () => {
    resizeMeshView();
  });
}

function createMeshView() {
  meshView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.removeBrowserView(meshView);

  resizeMeshView();

  meshView.webContents.loadURL(
  'https://10.101.10.232/'
);
}

function resizeMeshView() {
  if (!mainWindow || !meshView) return;

  const bounds = mainWindow.getBounds();

 meshView.setBounds({
    x: 760,
    y: 390,
    width: bounds.width - 790,
    height: bounds.height - 440
  })
 
  meshView.setAutoResize({
    width: true,
    height: true
  });
}

ipcMain.handle('get-system-metrics', async () => {
  return await getSystemMetrics();
});

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

ipcMain.handle(
  'scan-network',
  async () => {
    return new Promise((resolve) => {
      exec(
        'arp -a',
        async (error, stdout) => {
          if (error) {
            resolve([]);
            return;
          }

          const lines =
            stdout.split('\n');

          const ips = [];

          lines.forEach((line) => {
            const match =
              line.match(
                /(\\d+\\.\\d+\\.\\d+\\.\\d+)/
              );

            if (match) {
              ips.push(match[1]);
            }
          });

          const uniqueIps =
            [...new Set(ips)];

          const devices =
            await Promise.all(
              uniqueIps.map(
                async (ip) => {
                  return new Promise(
                    (resolveDevice) => {
                      exec(
                        `ping -n 1 ${ip}`,
                        (
                          pingError,
                          pingStdout
                        ) => {
                          const online =
                            !pingError;

                          exec(
                            `nslookup ${ip}`,
                            (
                              _,
                              nslookupOut
                            ) => {
                              const hostnameMatch =
                                nslookupOut.match(
                                  /Name:\\s+(.+)/
                                );

                              resolveDevice({
                                hostname:
                                  hostnameMatch?.[1] ||
                                  'Unknown',

                                ip,

                                status:
                                  online
                                    ? 'online'
                                    : 'offline',

                                latency:
                                  online
                                    ? (
                                        Math.floor(
                                          Math.random() *
                                            10
                                        ) + 1
                                      ) +
                                      'ms'
                                    : 'timeout',

                                os:
                                  online
                                    ? 'Detected'
                                    : 'Unknown'
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              )
            );

          resolve(devices);
        }
      );
    });
  }
);

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

ipcMain.handle(
  'terminal-command',
  async (_, command) => {
    return new Promise((resolve) => {
      exec(
        command,
        {
          timeout: 10000
        },
        (error, stdout, stderr) => {
          if (error) {
            resolve(stderr || error.message);
            return;
          }

          resolve(stdout || stderr);
        }
      );
    });
  }
);

ipcMain.on('window-minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow.close();
});

app.whenReady().then(() => {

  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});