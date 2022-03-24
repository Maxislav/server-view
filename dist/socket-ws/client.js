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
const types_1 = require("./types");
class MyClient {
    constructor(id, wsClient) {
        this.id = id;
        this.wsClient = wsClient;
        this._cbDisconnected = [];
        this.nameMap = new Map();
        console.log('connected', id);
        wsClient.on('message', (data) => {
            //console.log('message -> ', JSON.parse(data.toString()));
            const jsonData = JSON.parse(data.toString());
            switch (jsonData.action) {
                case types_1.EAction.CONNECTED: {
                    console.log('action message connected');
                    break;
                }
                case types_1.EAction.PING: {
                    console.log('action message ping', data.toString());
                    break;
                }
                case types_1.EAction.MESSAGE: {
                    console.log('action message message');
                    break;
                }
            }
        });
        wsClient.on('close', (d) => {
            this._cbDisconnected.forEach(cb => {
                cb(this.id);
            });
        });
    }
    get$(name, cb) {
        this.nameMap.set(name, cb);
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
        clearInterval(this._intervalId);
    }
}
exports.MyClient = MyClient;
MyClient.listenerHashMap = {};
//# sourceMappingURL=client.js.map