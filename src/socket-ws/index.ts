import WebSocket from 'ws'
import { MyClient } from './client';
import { hash } from './hash';

const PORT = 3001;
const wsServer = new WebSocket.Server({ port: PORT }, () => {
    console.log(`ws server started on port: ${PORT}`)
});

const CLIENT_MAP: {
    [id: string]: MyClient;
} = {};


wsServer.on('connection', (wsClient: WebSocket) => {
    const client = new MyClient(hash(40), wsClient);
    CLIENT_MAP[client.id] = client;
    console.log('connection length: ' + Object.keys(CLIENT_MAP).length);

    let interval = setInterval(async () => {
        const s = await client.send(JSON.stringify({
            action: 'PING',
            data: hash(2),
            clientId: client.id,
        }));
        if (!s) {
            clearInterval(interval);
            client.close();
            console.log(`client with id ${client.id} Err connect`);

            delete CLIENT_MAP[client.id];
            console.log('connection length: ' + Object.keys(CLIENT_MAP).length)
        }
    }, 5000);

    client.onDisconnected((id) => {
        console.log(`client with id ${id} Disconnected`);
        clearInterval(interval);
        delete CLIENT_MAP[id];
        console.log('connection length: ' + Object.keys(CLIENT_MAP).length)
    })

});
