"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClient = void 0;
const hash_1 = require("./hash");
class MyClient {
    constructor(id, wsClient) {
        this.id = id;
        this.wsClient = wsClient;
        this._cbDisconnected = [];
        const vehicleId = (0, hash_1.hash)(5);
        console.log('connected', id);
        wsClient.on('message', (data) => {
            console.log(JSON.parse(data.toString()));
        });
        wsClient.on('close', (d) => {
            this._cbDisconnected.forEach(cb => {
                cb(this.id);
            });
        });
        /* this.intervalId = setInterval(() => {
             this.send(JSON.stringify({
                 action: 'MESSAGE',
                 data: {
                     name: 'vehicleMove',
                     data: {
                         vehicleId: vehicleId,
                         lngLat: [50, 30],
                     },
                 },
             }));
         }, 10000)*/
    }
    send(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.wsClient.send(data, (err) => {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });
    }
    onDisconnected(cb) {
        this._cbDisconnected.push(cb);
        return () => {
            const i = this._cbDisconnected.indexOf(cb);
            this._cbDisconnected.splice(i, 1);
        };
    }
    close() {
        clearInterval(this.intervalId);
    }
}
exports.MyClient = MyClient;
//# sourceMappingURL=client.js.map