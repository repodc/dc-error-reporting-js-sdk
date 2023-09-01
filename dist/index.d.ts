declare class DcErrorReportingSdk {
    private apiUrl;
    private hostname;
    private systemName;
    private enviroment;
    private token;
    constructor(systemName: string, enviroment: string, token: string);
    send(error: any, requestedUrl?: string): void;
}
