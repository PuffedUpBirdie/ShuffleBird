// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('funcs', {
    loadFolder: () => ipcRenderer.invoke('loadFolder'),
    loadImage: ((filepath: string) => ipcRenderer.invoke('loadImage', filepath)),
    getDirFilesList: (data: string) => ipcRenderer.invoke('getDirFilesList', data),
    setFullscreen: (isEnabled: boolean ) => ipcRenderer.invoke('setFullscreen', isEnabled),
    isFullscreen: () => ipcRenderer.invoke('isFullscreen'),
    addFullscreenEventHandler: (callback: (arg0: boolean) => void) => ipcRenderer.on('fullscreen-switched', (_event, value) => callback(value)),
    removeFullscreenEventHandler: (callback: (arg0: boolean) => void) => ipcRenderer.off('fullscreen-switched', (_event, value) => callback(value)),
});