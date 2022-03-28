"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyClient = void 0;
const types_1 = require("./types");
const rxjs_1 = require("rxjs");
const hash_1 = require("./hash");
class MyClient {
    constructor(id, wsClient) {
        this.id = id;
        this.wsClient = wsClient;
        this._cbDisconnected = [];
        this.pathMap = new Map();
        this.onDestroy$ = new rxjs_1.Subject();
        console.log(`connected id: ${(id).slice(0, 5)}...`);
        Object.setPrototypeOf(this.constructor.prototype, wsClient);
        this.on = wsClient.on.bind(wsClient);
        this.send = wsClient.send.bind(wsClient);
        (0, rxjs_1.interval)(5000)
            .pipe((0, rxjs_1.takeUntil)(this.onDestroy$), (0, rxjs_1.switchMap)(() => {
            const d = {
                action: types_1.EAction.PING,
                data: {
                    path: '',
                    hash: (0, hash_1.hash)(2),
                    message: this.id
                },
            };
            return this.send$(d);
        }), (0, rxjs_1.catchError)(() => {
            this.onDestroy();
            return this.onDestroy$;
        }))
            .subscribe();
        this.on('close', () => {
            this.onDestroy();
        });
        this.on('message', (data) => {
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
                    console.log('action message message', data.toString());
                    const m = JSON.parse(data.toString());
                    const path = m.data.path;
                    const cb = this.pathMap.get(path);
                    cb === null || cb === void 0 ? void 0 : cb(m);
                    break;
                }
            }
        });
        this.on('close', (d) => {
            this.wsClose();
        });
        this.get$('get-local-id', () => {
        });
    }
    get$(name, cc) {
        const cb = (m) => {
            const h = m.data.hash;
        };
        this.pathMap.set(name, cb);
        return new rxjs_1.Observable((subscriber) => {
        });
    }
    send$(data) {
        return new rxjs_1.Observable((subscriber) => {
            this.send(JSON.stringify(data), (err) => {
                if (err) {
                    subscriber.error(err);
                }
                else {
                    subscriber.next(true);
                    subscriber.complete();
                }
            });
        });
    }
    wsClose() {
        this.onDestroy();
    }
    onDestroy() {
        this.onDestroy$.next(this.id);
        this.onDestroy$.complete();
    }
}
exports.MyClient = MyClient;
MyClient.listenerHashMap = {};
//# sourceMappingURL=client.js.map