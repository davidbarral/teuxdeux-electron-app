const { app, BrowserWindow, Menu } = require("electron");

let windows = [];
let lastUrl = null;

const TEUXDEUX_URL = "https://teuxdeux.com";

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: app.getName(),
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "close" }, { role: "minimize" }, { role: "zoom" }, { type: "separator" }, { role: "front" }],
    },
  ]),
);

const createWindow =
  (url = TEUXDEUX_URL) =>
  () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 960,
      title: "TeuxDeux",
      titleBarStyle: "hiddenInset",
      backgroundColor: "#ffffff",
      minWidth: 900,
      minHeight: 700,
      webPreferences: {
        devTools: true,
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true,
        enableRemoteModule: false,
      },
    });

    win.meta = { url };
    win.loadURL(url, { extraHeaders: "pragma: no-cache\n" });

    win.on("close", () => {
      lastUrl = win.meta.url;
      windows = windows.filter((w) => w !== win);
    });

    win.webContents.on("did-finish-load", async () => {
      await win.webContents.insertCSS(`
        .header {
          position: fixed;
          z-index: 100;
          -webkit-app-region: drag;
        }

        .authed .header__container>h1 {
          margin-left: 70px;
        }

        @media (max-width: 48em) {
          .authed .header__container>h1 {
            margin-left: 0px;
            --app-container-gutter: 80px;
          }
        }

        @media (min-width: 60em) {
          .authed .header__container>h1 {
            margin-left: 18px;
          }
        }

        [role=contentinfo] {
          display: none !important;
        }
      `);
    });

    windows.push(win);
  };

app.on("ready", createWindow());

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (windows.length === 0) {
    createWindow(lastUrl)();
  }
});
