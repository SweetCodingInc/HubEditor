import { Server, ServerOptions, createServer } from 'restify';

class HubEditor {
    private _instance: Server;
    private _serverOptions: ServerOptions = {};
    private _port: number = 3000;

    constructor() {
        this._instance = createServer(this._serverOptions);
    }


    public get instance(): Server {
        return this._instance;
    }


    start() {
        this._instance.listen(this._port, this.success.bind(this));
    }

    success() {
        console.log(`Server Running on ${this._port}`);
    }
}

export const HubEditorInstance = new HubEditor();