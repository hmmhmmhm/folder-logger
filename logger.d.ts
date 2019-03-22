declare module 'folder-logger' {

    namespace FolderLogger {
        interface IMessageLevel {
            info: 0
            system: 1,
            warn: 2,
            error: 3,
            critical: 4,
            debug: 5
        }
    
        interface ILogOption {
            noPrint: boolean
            noWrite: boolean
            noFormat: boolean
        }
    
        enum MessageLevelNamesType {
            "info",
            "system",
            "warn",
            "error",
            "critical",
            "debug"
        }
    
        interface ILogger {
            info: (message: string, option?: ILogOption) => ILogger
            system: (message: string, option?: ILogOption) => ILogger
            warn: (message: string, option?: ILogOption) => ILogger
            error: (message: string, option?: ILogOption) => ILogger
            critical: (message: string, option?: ILogOption) => ILogger
            debug: (message: string, option?: ILogOption) => ILogger
    
            level: IMessageLevel
            levelName: MessageLevelNamesType
    
            /**
             * @description
             * 실제 콘솔화면에 출력될 로그의 최대 레벨을 정합니다.
             */
            setLevel: (level: MessageLevelNamesType) => ILogger
            setLogPath: (path: string) => ILogger
        }
    
        type LogFormatType = (log: string, level: MessageLevelNamesType, logger: ILogger) => string 
    
        interface ILoggerConstructorOption {
            /**
             * `txt`
             */
            ext?: string
    
            /**
             * `YYYY-MM-DD`
             */
            timeFormat?: string
    
            /**
             * `2090-11-11T11:11:11`
             */
            momentOption?: string
    
            logFormat?: LogFormatType
        }
    
        interface ILoggerConstructor {
            new (logFolderPath: string, option?: ILoggerConstructorOption): ILogger
        }
    }

    const FolderLogger: FolderLogger.ILoggerConstructor
    export = FolderLogger
}