import WebSocket, { ServerOptions } from 'ws'
import { MyClient } from './client';
import { hash } from './hash';
import { EAction, IData } from './types';

const PORT = 3001;

class AppServer extends WebSocket.Server {

    constructor(options?: ServerOptions, cb?: () => void) {
        super(options, cb);
    }
}

const wsServer = new AppServer({ port: PORT }, () => {
    console.log(`ws server started on port: ${PORT}`)
});

const CLIENTS: Map<string, MyClient> = new Map();

wsServer.on('connection', (wsClient: WebSocket) => {
    const clientId = hash(140)
    const client = new MyClient(clientId, wsClient);
    CLIENTS.set(clientId, client);
    console.log('connected', 'connection length', CLIENTS.size)
    client.onDestroy$
        .subscribe((id) => {
            console.log(`client with id ${(client.id).slice(0, 5)}... Err connect`);
            CLIENTS.delete(id)
        })
});
