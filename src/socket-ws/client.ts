import WebSocket from 'ws';
import { EAction, IData } from './types';
import Timer = NodeJS.Timer;
import { catchError, interval, Observable, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import { hash } from './hash';

interface Res {
    end: (data: any) => void;
}

export class MyClient {
    private _intervalId: Timer;
    private _cbDisconnected: Array<(id: string) => () => void> = [];
    public on: (name: string, callback: Function) => void;
    public send: (name: string, callback: Function) => void;
    public emit: Function;

    pathMap: Map<string, (m: IData<any>) => void> = new Map()

    private static listenerHashMap: { [name: string]: any } = {};

    public onDestroy$: Subject<string> = new Subject()

    constructor(public id: string, private wsClient: WebSocket) {
        console.log(`connected id: ${(id).slice(0, 5)}...`);
        Object.setPrototypeOf(this.constructor.prototype, wsClient);
        this.on = wsClient.on.bind(wsClient);
        this.send = wsClient.send.bind(wsClient);

        interval(5000)
            .pipe(
                takeUntil(this.onDestroy$),
                switchMap(() => {
                    const d: IData<string> = {
                        action: EAction.PING,
                        data: {
                            path: '',
                            hash: hash(2),
                            message: this.id
                        },
                    }
                    return this.send$(d)
                }),
                catchError(() => {
                    this.onDestroy()
                    return this.onDestroy$
                })
            )
            .subscribe()
        this.on('close', () => {
           this.onDestroy()
        })
        this.on('message', (data) => {
            const jsonData: IData<any> = JSON.parse(data.toString())
            switch (jsonData.action) {
                case EAction.CONNECTED: {
                    console.log('action message connected')
                    break
                }
                case EAction.PING: {
                    console.log('action message ping', data.toString())
                    break
                }
                case EAction.MESSAGE: {
                    console.log('action message message', data.toString())
                    const m: IData<any> = JSON.parse(data.toString())
                    const path = m.data.path
                    const cb = this.pathMap.get(path)
                    cb?.(m)

                    break
                }
            }
        });
        this.on('close', (d) => {
            this.wsClose()
        })
        this.get$('get-local-id', () => {

        })
    }

    get$(name: string, cc: () => void) {
        const cb = (m: IData<any>) => {
            const h = m.data.hash
        }
        this.pathMap.set(name, cb)
        return new Observable((subscriber) => {

        })
    }


    send$(data: any): Observable<boolean> {
        return new Observable((subscriber) => {
            this.send(JSON.stringify(data), (err) => {
                if (err) {
                    subscriber.error(err);
                } else {
                    subscriber.next(true);
                    subscriber.complete();
                }
            })
        })
    }

    wsClose(): void{
        this.onDestroy()
    }

    onDestroy(): void {
        this.onDestroy$.next(this.id)
        this.onDestroy$.complete()
    }

}
