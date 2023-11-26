const { BrowserWindow } = require('electron');
const path = require('path');

const router = window => {
    const url = window.webContents.getURL();
    
    window.loadFile(path.join(__dirname, '../build/index.html'));

    if (true) {
    } else {
        window.loadURL('https://dev1-radiologist.getdentalray.com');
    }

    console.log(url, 'url')
    // and load the index.html of the app.
    
    // mainWindow.loadURL('https://radiologist.getdentalray.com/viewer/?StudyInstanceUIDs=1.2.276.0.7230010.3.1.2.650563195.8732.1700499704.346');
    // mainWindow.loadURL('/viewer');
}

const windowWithRouter = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.maximize();
    router(mainWindow);
    mainWindow.webContents.openDevTools();

    return mainWindow;
};

const windowWithRouterAndCORS = () => {
    const window = windowWithRouter();

    // Modify the origin for all requests to the following urls.
    const filter = {
        urls: [
            'https://cloudpacs.getdentalray.com/*',
            /**
             * @todo Change path to scope local packaged files
             */
            'file:///Users/alecpayos/Projects/electron-dicomweb/build/*'
        ]
    };

    const webRequest = window.webContents.session.webRequest;

    webRequest.onBeforeSendHeaders(
        filter,
        (details, callback) => {
            /**
             * @todo Add logger here for every request done by user.
             */
            // console.log(details);
            details.requestHeaders['Origin'] = 'https://cloudpacs.getdentalray.com';
            callback({ requestHeaders: details.requestHeaders });
        }
    );

    webRequest.onHeadersReceived(
        filter,
        (details, callback) => {
            /**
             * @todo Add logger here for every request done by user.
             */
            // console.log(details);
            details.responseHeaders['Access-Control-Allow-Origin'] = '*';
            details.responseHeaders['Cross-Origin-Embedder-Policy'] = "require-corp";
            details.responseHeaders['Cross-Origin-Opener-Policy'] = "same-origin";
            // details.responseHeaders['Content-Type'] = "application/javascript";
            callback({ responseHeaders: details.responseHeaders });
        }
    );
}

module.exports = {
    windowWithRouterAndCORS,
}