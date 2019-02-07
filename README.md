<img src="https://i.imgur.com/Odmf7O5.png" alt="icon" width="128"/>

# Folder-Logger

> **Easy** log management.
>
> **Categorized by folder** according to importance
>
> **Categorized by date/time**, automatic file classification
>
> **Beautiful basic** text formatting

This logger module is easy to use in Node.js.

[한국어 문서는 여기로 와주세요](https://github.com/hmmhmmhm/folder-logger/blob/master/README.KOR.md)




## Use example

Folder-Logger has the basic functionality of applying even text formatting to all logs.  This feature can be customized to suit user needs, and can be turned off or processed as written to files, not as displayed on the console.

### Example of using Bash

This is what you see when you use Bash on Windows and Mac. It is recommended to use the Bash-based console whenever possible.  

![](https://i.imgur.com/Qsjl5iz.png)

### Example of using Windows CMD

Folder-Logger's default text formatting is configured to take CMD of Windows Basics with no variation.

![](https://i.imgur.com/oEexOjH.png)

### Example of log data categorized as folders

![](https://i.imgur.com/tjjQCf1.png)

Folder-Logger categorizes logs in log importance and stores them in different folders. Because these folders are stored according to the date, the logs that correspond to the criticality and date and time you are looking for can be easily found in any editor by physical folder and file classification without plug-ins or searches.

### Example of log data stored

![](https://i.imgur.com/Bv3Nrzs.png)

If any ANSI color is used in the text or special characters are used, Unicode displayed in the console is neatly organized with time without breaking the log. The user can customize the saved log type, and these log formatting can be turned off and on freely according to the log.



## How to use

### Installing a module

```bash
npm install --save folder-logger
```

### Create Logger

You do not need to pre-create a folder path to store logs or create a new log file. If there is no folder hierarchy in the specified folder path, the folder is created and the log file is automatically created (although the program is turned on again, the log is not initialized, and continuous log creation is performed).

```javascript
// ES5
const FolderLogger = require('folder-logger')

// Folder location to store logs
const path = `${__dirname}/logs/`

// Create a logger instance
const logger = new FolderLogger(path)
```

### Send logger message

```javascript
var message = `Lorem ipsum dolor sit amet`

// Prints a basic info message.
logger.info(message)

// Prints a system message.
logger.system(message)

// Prints a warning message.
logger.warn(message)

// Prints a error message.
logger.error(message)

// Prints a critical error message.
logger.critical(message)

// Prints a debugging message.
logger.debug(message)
```

### Logger level classifications 

There are a total of 6 different log classifications for Folder-Logger, and there are 0 to 5 criticality classifications.

```javascript
const level = {
    info: 0,
    system: 1,
    warn: 2,
    error: 3,
    critical: 4,
    debug: 5
}
```

These 'level' objects can be imported from the logger at any time in the following way:

```javascript
// Returns the level object above.
logger.level()

// Returns the keys of a level object.
logger.levelNames()
```

### Setting the Logger Level

Folder-Logger has the ability to set the level of log messages displayed on the console. For example, if `3` is set, a higher level log will not be displayed on the console. Regardless of the set log level, all logs are normally recorded on the file. (The default logger level is `5`)

```javascript
// In this case, the debug message will not be displayed.
logger.setLevel(4)

// In this case, only the info message will be displayed.
logger.setLevel(0)
```



## Advanced How to Use

### Apply logger message options

```javascript
logger.info(`Hello?`, {
    noPrint: false, // Default is false
    noWrite: false // Default is false
    noFormat: false, // Default is false
})
```

The options can be configured as a second parameter object in all functions `info`, `system`, `warn`, `error`, `critical`,`debug`. The options are described below.

#### noPrint <boolean>

If the option is treated as `true`, the message will not be output on the console.  With these options, you can implement log messages that are logged only on the file and not on the screen.

#### noWrite <boolean>

If the option is treated as `true`, the message will not be logged in the file.  You can use these options to implement log messages that are only on-screen and are not recorded in the file.

#### noFormat <boolean>

If the option is treated as `true`, default text formatting is not applied to the message. This is the same as the message stored in the file and all messages displayed on the console. <u> If saves the log with the option enabled, the time when the message occurred is not recorded, so use it with carelessly.</u>

### Change the location of the logger message

The function below allows the module to change the storage location of the logger message during execution. Existing log files are automatically closed and folder hierarchies and files are automatically created if no log folder path exists.

```javascript
// New Folder Location to Save Logs
const path = `${__dirname}/logs/`

// Change the location where the logs are stored.
logger.setLogPath(path)
```

### Using the log function

If you do not want to use the function name differently depending on the level classification, you can also specify the log level as an option using the log function as shown below. (If no log level is specified, the `info` level is applied automatically.)

```javascript
logger.log({
    level: logger.level.info // You can also type 0 to 5.
})
```



## Customizing method

### Change log file extension

The log file extension stored by default is `.log`. If you want to use a different extension, you can designate it as a second parameter object when you create a logger instance.

```javascript
// Create a logger instance
const logger = new FolderLogger(path, {
    ext: `txt` // In this case, it is saved with a .txt extension.
})
```

### Change Log File Time Formatting

In Folder-Logger, the time format used for log files depends on the `moment.js` module and can be freely converted to a 'date format' compatible with `moment.js`. In other words, you can specify a date shape in the form of a string. By default, the designated date format is YYYY-MM-DD.

```javascript
// Create a logger instance
const logger = new FolderLogger(path, {
    timeFormat: `YYYY-MM-DD` // Ex: 2019-02-06
})
```

### Apply moment.js option to log file time format

If there is a `moment.js` option, such as setting the time zone while using Folder-Logger, which requires direct use in the form of `moment(/* here */)`, it can be applied as follows:

```javascript
// Create a logger instance
const logger = new FolderLogger(path, {
    momentOption: `2090-11-11T11:11:11`
})
```

### Change Log Text Formatting

Text formatting used to customize Folder-Logger can be freely customized by the user. Here's how to use it:

```javascript
// This color representation module
// will be used for formatting.
const chalk = require('chalk')

// Formating function
// (Basic function is enclosed as an example).
const myLogFormat = (log, level, logger) => {
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

// Create a logger instance
const logger = new FolderLogger(path, {
    logFormat: myLogFormat
})
```



## Logo Icon Source

<div>Icons made by <a href="https://www.flaticon.com/authors/smalllikeart" title="smalllikeart">smalllikeart</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>



## License

MIT Licensed.