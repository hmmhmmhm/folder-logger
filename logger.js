const fs = require('fs')
const fx = require('mkdir-recursive')
const path = require('path')
const moment = require('moment')
const removeANSI = require("strip-ansi")
const chalk = require('chalk')

const level = {
    info: 0,
    system: 1,
    warn: 2,
    error: 3,
    critical: 4,
    debug: 5
}

const levelNames = Object.keys(level)

const defaultLogFormat = (log, level, logger) => {
    let defaultFormat ='%time%  %level%  \t\b\b\b\b' + '%log%'
    let time = moment(logger.momentOption).format('hh:mm:ss')
    let levelName = String(logger.levelNames[level]).toUpperCase()
    switch(levelName){
        case 'CRITICAL':
            time = chalk.bgRedBright(chalk.black(time))
            levelName = chalk.bgRedBright(chalk.black(levelName))
            log = chalk.bgRedBright(chalk.black(log))
            break
        case 'WARN':
            time = chalk.bgYellowBright(chalk.black(time))
            levelName = chalk.bgYellowBright(chalk.black(levelName))
            log = chalk.bgYellowBright(chalk.black(log))
            break
        case 'ERROR':
            time = chalk.bgRedBright(chalk.white(time))
            levelName = chalk.bgRedBright(chalk.white(levelName))
            log = chalk.bgRedBright(chalk.white(log))
            break
        case 'DEBUG':
            time = chalk.greenBright(time)
            levelName = chalk.greenBright(levelName)
            log = chalk.greenBright(log)
            break
        case 'SYSTEM':
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
    let text = defaultFormat
        .replace('%time%', time)
        .replace('%level%', levelName)
        .replace('%log%', log)
    return text
}

class FolderLogger {
    constructor(_logPath, option={}){
        this.logTime = null
        this.stream = [null,null,null,null,null]
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

    get level(){
        return level
    }
    get levelNames(){
        return levelNames
    }

    /**
     * 
     * @param {number} _level 
     */
    setLevel(_level){
        this.showLevel = _level
        return this
    }

    info(input, option={}){
        option.level = level.info
        this.log(input, option)
        return this
    }
    system(input, option={}){
        option.level = level.system
        this.log(input, option)
        return this
    }
    warn(input, option={}){
        option.level = level.warn
        this.log(input, option)
        return this
    }
    error(input, option={}){
        option.level = level.error
        this.log(input, option)
        return this
    }
    critical(input, option={}){
        option.level = level.critical
        this.log(input, option)
        return this
    }
    debug(input, option={}){
        option.level = level.debug
        this.log(input, option)
        return this
    }
    log(input, option={}){
        // Init Default Options
        if(typeof option != 'object') option = {}
        if(typeof option.level == 'undefined') option.level = level.info
        if(typeof option.noPrint == 'undefined') option.noPrint = false
        if(typeof option.noFormat == 'undefined') option.noFormat = false
        if(typeof option.noWrite == 'undefined') option.noWrite = false

        // Check Log Level Range
        if(typeof levelNames[option.level] == 'undefined')
            throw new Error('Log level is wrong')

        // Open New Stream
        if(this.stream[option.level] == null){
            fx.mkdirSync(path.join(this.logPath, `/${levelNames[option.level]}`))
            this.stream[option.level] = fs.createWriteStream(
                path.join(
                    this.logPath, 
                    `/${levelNames[option.level]}/${this.logTime}.${this.ext}`
                ), {flags: 'a'}
            )
        }

        // Apply Log Format
        let logText = input
        if(!option.noFormat)
            logText = this.logFormat(logText, option.level, this)

        // Append Log Text
        if(!option.noWrite){
            // Remove ANSI
            let clearedText = removeANSI(logText)

            // Remove some escape sequences
            clearedText = `${clearedText.replace(/[\t\b]/gi, '')}\n`
            this.stream[option.level].write(clearedText)
        }

        // Print Log Text
        if(!isNaN(this.showLevel) && Number(this.showLevel) >= Number(option.level)){
            if(!option.noPrint){
                if(option.noFormat){
                    process.stdout.write(logText)
                }else{
                    console.log(logText)
                }
            }
        }
        return this
    }
    setLogPath(_logPath){
        fx.mkdirSync(_logPath)
        this.logPath = _logPath
        this.checkRefresh()

        return this
    }
    checkRefresh(){
        let newLogTime = moment(this.momentOption).format(this.timeFormat)
        if(this.logTime != newLogTime){

            // Refrash Log Time
            this.logTime = newLogTime

            // Close Before Stream
            this.close()
        }
        return this
    }
    close(){
        // Close Before Stream
        for(let i=0;i<=5;i++){
            if(this.stream[i] != null){
                this.stream[i].end()
                this.stream[i] = null
            }
        }
    }
}

module.exports = FolderLogger