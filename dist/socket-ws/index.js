"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const client_1 = require("./client");
const hash_1 = require("./hash");
const PORT = 3001;
class AppServer extends ws_1.default.Server {
    constructor(options, cb) {
        super(options, cb);
    }
}
const wsServer = new AppServer({ port: PORT }, () => {
    console.log(`ws server started on port: ${PORT}`);
});
const CLIENTS = new Map();
wsServer.on('connection', (wsClient) => {
    const clientId = (0, hash_1.hash)(140);
    const client = new client_1.MyClient(clientId, wsClient);
    CLIENTS.set(clientId, client);
    console.log('connected', 'connection length', CLIENTS.size);
    client.onDestroy$
        .subscribe((id) => {
        console.log(`client with id ${(client.id).slice(0, 5)}... Err connect`);
        CLIENTS.delete(id);
    });
});
//# sourceMappingURL=index.js.map