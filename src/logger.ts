import fs from 'fs'
import fx from 'mkdir-recursive'
import path from 'path'
import moment from 'moment'
import removeANSI from 'strip-ansi'
import chalk from 'chalk'

export interface IMessageLevel {
    info: 0
    system: 1,
    warn: 2,
    error: 3,
    critical: 4,
    debug: 5
}

const level: IMessageLevel = {
    info: 0,
    system: 1,
    warn: 2,
    error: 3,
    critical: 4,
    debug: 5
}

export type MessageLevelType
    = 0
    | 1
    | 2
    | 3
    | 4
    | 5

export interface ILogOption {
    noPrint?: boolean
    noWrite?: boolean
    noFormat?: boolean
    useProcessOut?: boolean
    level?: MessageLevelType
}

const levelNames = Object.keys(level)

export enum MessageLevelNamesType {
    "info",
    "system",
    "warn",
    "error",
    "critical",
    "debug"
}

const defaultLogFormat = (log, level, logger) => {
    let time = moment(logger.momentOption).format('HH:mm:ss')
    let levelName = String(logger.levelNames[level]).toUpperCase()

    let margin = ''
    switch (levelName) {
        case 'CRITICAL':
            margin = '  '
            time = chalk.bgRedBright(chalk.black(time))
            levelName = chalk.bgRedBright(chalk.black(levelName))
            log = chalk.bgRedBright(chalk.black(log))
            break
        case 'WARN':
            margin = '      '
            time = chalk.bgYellowBright(chalk.black(time))
            levelName = chalk.bgYellowBright(chalk.black(levelName))
            log = chalk.bgYellowBright(chalk.black(log))
            break
        case 'ERROR':
            margin = '     '
            time = chalk.bgRedBright(chalk.white(time))
            levelName = chalk.bgRedBright(chalk.white(levelName))
            log = chalk.bgRedBright(chalk.white(log))
            break
        case 'DEBUG':
            margin = '     '
            time = chalk.greenBright(time)
            levelName = chalk.greenBright(levelName)
            log = chalk.greenBright(log)
            break
        case 'SYSTEM':
            margin = '    '
            time = chalk.yellowBright(time)
            levelName = chalk.yellowBright(levelName)
            log = chalk.yellowBright(log)
            break

        default:
            time = chalk.white(time)
            levelName = chalk.white(levelName)
            log = chalk.white(log)
            break
    }
    let defaultFormat = `%time%  %level%${margin} %log%`
    let text = defaultFormat
        .replace('%time%', time)
        .replace('%level%', levelName)
        .replace('%log%', log)
    return text
}

export type LogFormatType = (log: string, level: MessageLevelNamesType, logger: FolderLogger) => string

export interface ILoggerConstructorOption {
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

    level?: MessageLevelType

    logFormat?: LogFormatType
}

export type StreamType = Array<fs.WriteStream | null>

class FolderLogger {
    logTime: string | null = null
    stream: StreamType = [null, null, null, null, null]
    showLevel?: MessageLevelType
    ext?: string
    timeFormat?: string
    logFormat?: LogFormatType
    momentOption?: string
    logPath: string

    constructor(_logPath: string, option: ILoggerConstructorOption = {}) {
        this.showLevel = (typeof option.level == 'undefined') ? 5 : option.level
        this.ext = (typeof option.ext == 'undefined') ? 'log' : option.ext
        this.timeFormat = (typeof option.timeFormat == 'undefined') ?
            'YYYY-MM-DD' : option.timeFormat
        this.logFormat = (typeof option.logFormat == 'undefined') ?
            defaultLogFormat : option.logFormat
        this.momentOption = (typeof option.momentOption == 'undefined') ?
            undefined : option.momentOption
        this.setLogPath(_logPath)
    }

    get level() {
        return level
    }
    get levelNames() {
        return levelNames
    }

    /**
     * 
     * @param {number} _level 
     */
    setLevel(_level: MessageLevelType) {
        this.showLevel = _level
        return this
    }

    info(input: string, option: ILogOption = {}) {
        option.level = level.info
        this.log(input, option)
        return this
    }
    system(input: string, option: ILogOption = {}) {
        option.level = level.system
        this.log(input, option)
        return this
    }
    warn(input: string, option: ILogOption = {}) {
        option.level = level.warn
        this.log(input, option)
        return this
    }
    error(input: string, option: ILogOption = {}) {
        option.level = level.error
        this.log(input, option)
        return this
    }
    critical(input: string, option: ILogOption = {}) {
        option.level = level.critical
        this.log(input, option)
        return this
    }
    debug(input: string, option: ILogOption = {}) {
        option.level = level.debug
        this.log(input, option)
        return this
    }
    log(input: string, option: ILogOption) {
        // Init Default Options
        if (typeof option != 'object') option = {}
        if (typeof option.level == 'undefined') option.level = level.info
        if (typeof option.noPrint == 'undefined') option.noPrint = false
        if (typeof option.noFormat == 'undefined') option.noFormat = false
        if (typeof option.useProcessOut == 'undefined') option.useProcessOut = false
        if (typeof option.noWrite == 'undefined') option.noWrite = false

        // Check Log Level Range
        if (typeof levelNames[option.level] == 'undefined')
            throw new Error('Log level is wrong')

        // Open New Stream
        if (this.stream[option.level] == null) {
            fx.mkdirSync(path.join(this.logPath, `/${levelNames[option.level]}`))
            this.stream[option.level] = fs.createWriteStream(
                path.join(
                    this.logPath,
                    `/${levelNames[option.level]}/${this.logTime}.${this.ext}`
                ), { flags: 'a' }
            )
        }

        // Apply Log Format
        let logText = input
        if (!option.noFormat && this.logFormat)
            logText = this.logFormat(logText, option.level, this)

        // Append Log Text
        if (!option.noWrite) {
            // Remove ANSI
            let clearedText = removeANSI(logText)

            // Remove some escape sequences
            clearedText = `${clearedText.replace(/[\t\b]/gi, '')}\n`
            let dataStream = this.stream[option.level]
            if (dataStream != null) dataStream.write(clearedText)
        }

        // Print Log Text
        if (!isNaN(Number(this.showLevel)) && Number(this.showLevel) >= Number(option.level)) {
            if (!option.noPrint) {
                if (option.useProcessOut) {
                    process.stdout.write(logText)
                } else {
                    console.log(logText)
                }
            }
        }
        return this
    }
    setLogPath(_logPath: string) {
        fx.mkdirSync(_logPath)
        this.logPath = _logPath
        this.checkRefresh()

        return this
    }
    checkRefresh() {
        let newLogTime = moment(this.momentOption).format(this.timeFormat)
        if (this.logTime != newLogTime) {

            // Refrash Log Time
            this.logTime = newLogTime

            // Close Before Stream
            this.close()
        }
        return this
    }
    close() {
        // Close Before Stream
        for (let i = 0; i <= 5; i++) {
            let dataStream = this.stream[i]
            if (dataStream != null) {
                dataStream.end()
                dataStream = null
            }
        }
    }
}

export { FolderLogger }
export default FolderLogger