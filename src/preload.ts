// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('funcs', {
    loadFolder: () => ipcRenderer.invoke('loadFolder'),
    loadImage: ((filepath: string) => ipcRenderer.invoke('loadImage', filepath)),
    getDirFilesList: (data: string) => ipcRenderer.invoke('getDirFilesList', data)
});