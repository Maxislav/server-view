import WebSocket from 'ws';
import { EAction, IData } from './types';
import Timer = NodeJS.Timer;

interface Res {
    end: (data: any) => void;
}

export class MyClient {
    private _intervalId: Timer;
    private _cbDisconnected: Array<(id: string) => () => void> = [];
    public on: (name: string, callback: Function) => void;
    public emit: Function;

    nameMap: Map<string, () => void> = new Map<string, () => void>()

    private static listenerHashMap: { [name: string]: any } = {};

    constructor(public id: string, private wsClient: WebSocket) {
        console.log('connected', id);
        wsClient.on('message', (data) => {
            //console.log('message -> ', JSON.parse(data.toString()));
            const jsonData: IData<any> = JSON.parse(data.toString())
            switch (jsonData.action){
                case EAction.CONNECTED: {
                    console.log('action message connected')
                    break
                }
                case EAction.PING: {
                    console.log('action message ping', data.toString())
                    break
                }
                case EAction.MESSAGE: {
                    console.log('action message message')
                    break
                }
            }
        });
        wsClient.on('close', (d) => {
            this._cbDisconnected.forEach(cb => {
                cb(this.id)
            })
        })
    }

    get$(name: string, cb: () => void) {
        this.nameMap.set(name, cb)
    }

    async send(data: any) {
        return new Promise((resolve, reject) => {
            this.wsClient.send(data, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true)
                }
            })
        })

    }

    onDisconnected(cb) {
        this._cbDisconnected.push(cb)
        return () => {
            const i = this._cbDisconnected.indexOf(cb);
            this._cbDisconnected.splice(i, 1)
        }
    }

    close() {
        clearInterval(this._intervalId)
    }
}
