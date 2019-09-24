import fs from 'fs';
export interface IMessageLevel {
    info: 0;
    system: 1;
    warn: 2;
    error: 3;
    critical: 4;
    debug: 5;
}
export declare type MessageLevelType = 0 | 1 | 2 | 3 | 4 | 5;
export interface ILogOption {
    noPrint?: boolean;
    noWrite?: boolean;
    noFormat?: boolean;
    level?: MessageLevelType;
}
export declare enum MessageLevelNamesType {
    "info" = 0,
    "system" = 1,
    "warn" = 2,
    "error" = 3,
    "critical" = 4,
    "debug" = 5
}
export declare type LogFormatType = (log: string, level: MessageLevelNamesType, logger: FolderLogger) => string;
export interface ILoggerConstructorOption {
    /**
     * `txt`
     */
    ext?: string;
    /**
     * `YYYY-MM-DD`
     */
    timeFormat?: string;
    /**
     * `2090-11-11T11:11:11`
     */
    momentOption?: string;
    level?: MessageLevelType;
    logFormat?: LogFormatType;
}
export declare type StreamType = Array<fs.WriteStream | null>;
declare class FolderLogger {
    logTime: string | null;
    stream: StreamType;
    showLevel?: MessageLevelType;
    ext?: string;
    timeFormat?: string;
    logFormat?: LogFormatType;
    momentOption?: string;
    logPath: string;
    constructor(_logPath: string, option: ILoggerConstructorOption);
    readonly level: IMessageLevel;
    readonly levelNames: string[];
    /**
     *
     * @param {number} _level
     */
    setLevel(_level: MessageLevelType): this;
    info(input: string, option?: ILogOption): this;
    system(input: string, option?: ILogOption): this;
    warn(input: string, option?: ILogOption): this;
    error(input: string, option?: ILogOption): this;
    critical(input: string, option?: ILogOption): this;
    debug(input: string, option?: ILogOption): this;
    log(input: string, option: ILogOption): this;
    setLogPath(_logPath: string): this;
    checkRefresh(): this;
    close(): void;
}
export { FolderLogger };
export default FolderLogger;
