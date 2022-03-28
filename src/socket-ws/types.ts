export enum EAction {
    PING = 'PING',
    CONNECTED = 'CONNECTED',
    MESSAGE = 'MESSAGE'
}

export interface IData<T> {
    action: EAction,
    data: {
        path: string,
        hash: string,
        message: T
    }
}

