"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var mkdir_recursive_1 = tslib_1.__importDefault(require("mkdir-recursive"));
var path_1 = tslib_1.__importDefault(require("path"));
var moment_1 = tslib_1.__importDefault(require("moment"));
var strip_ansi_1 = tslib_1.__importDefault(require("strip-ansi"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var level = {
    info: 0,
    system: 1,
    warn: 2,
    error: 3,
    critical: 4,
    debug: 5
};
var levelNames = Object.keys(level);
var MessageLevelNamesType;
(function (MessageLevelNamesType) {
    MessageLevelNamesType[MessageLevelNamesType["info"] = 0] = "info";
    MessageLevelNamesType[MessageLevelNamesType["system"] = 1] = "system";
    MessageLevelNamesType[MessageLevelNamesType["warn"] = 2] = "warn";
    MessageLevelNamesType[MessageLevelNamesType["error"] = 3] = "error";
    MessageLevelNamesType[MessageLevelNamesType["critical"] = 4] = "critical";
    MessageLevelNamesType[MessageLevelNamesType["debug"] = 5] = "debug";
})(MessageLevelNamesType = exports.MessageLevelNamesType || (exports.MessageLevelNamesType = {}));
var defaultLogFormat = function (log, level, logger) {
    var defaultFormat = '%time%  %level%  \t\b\b\b\b' + '%log%';
    var time = moment_1.default(logger.momentOption).format('HH:mm:ss');
    var levelName = String(logger.levelNames[level]).toUpperCase();
    switch (levelName) {
        case 'CRITICAL':
            time = chalk_1.default.bgRedBright(chalk_1.default.black(time));
            levelName = chalk_1.default.bgRedBright(chalk_1.default.black(levelName));
            log = chalk_1.default.bgRedBright(chalk_1.default.black(log));
            break;
        case 'WARN':
            time = chalk_1.default.bgYellowBright(chalk_1.default.black(time));
            levelName = chalk_1.default.bgYellowBright(chalk_1.default.black(levelName));
            log = chalk_1.default.bgYellowBright(chalk_1.default.black(log));
            break;
        case 'ERROR':
            time = chalk_1.default.bgRedBright(chalk_1.default.white(time));
            levelName = chalk_1.default.bgRedBright(chalk_1.default.white(levelName));
            log = chalk_1.default.bgRedBright(chalk_1.default.white(log));
            break;
        case 'DEBUG':
            time = chalk_1.default.greenBright(time);
            levelName = chalk_1.default.greenBright(levelName);
            log = chalk_1.default.greenBright(log);
            break;
        case 'SYSTEM':
            time = chalk_1.default.yellowBright(time);
            levelName = chalk_1.default.yellowBright(levelName);
            log = chalk_1.default.yellowBright(log);
            break;
        default:
            time = chalk_1.default.white(time);
            levelName = chalk_1.default.white(levelName);
            log = chalk_1.default.white(log);
            break;
    }
    var text = defaultFormat
        .replace('%time%', time)
        .replace('%level%', levelName)
        .replace('%log%', log);
    return text;
};
var FolderLogger = /** @class */ (function () {
    function FolderLogger(_logPath, option) {
        this.logTime = null;
        this.stream = [null, null, null, null, null];
        this.showLevel = (typeof option.level == 'undefined') ? 5 : option.level;
        this.ext = (typeof option.ext == 'undefined') ? 'log' : option.ext;
        this.timeFormat = (typeof option.timeFormat == 'undefined') ?
            'YYYY-MM-DD' : option.timeFormat;
        this.logFormat = (typeof option.logFormat == 'undefined') ?
            defaultLogFormat : option.logFormat;
        this.momentOption = (typeof option.momentOption == 'undefined') ?
            undefined : option.momentOption;
        this.setLogPath(_logPath);
    }
    Object.defineProperty(FolderLogger.prototype, "level", {
        get: function () {
            return level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FolderLogger.prototype, "levelNames", {
        get: function () {
            return levelNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param {number} _level
     */
    FolderLogger.prototype.setLevel = function (_level) {
        this.showLevel = _level;
        return this;
    };
    FolderLogger.prototype.info = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.info;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.system = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.system;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.warn = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.warn;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.error = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.error;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.critical = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.critical;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.debug = function (input, option) {
        if (option === void 0) { option = {}; }
        option.level = level.debug;
        this.log(input, option);
        return this;
    };
    FolderLogger.prototype.log = function (input, option) {
        // Init Default Options
        if (typeof option != 'object')
            option = {};
        if (typeof option.level == 'undefined')
            option.level = level.info;
        if (typeof option.noPrint == 'undefined')
            option.noPrint = false;
        if (typeof option.noFormat == 'undefined')
            option.noFormat = false;
        if (typeof option.noWrite == 'undefined')
            option.noWrite = false;
        // Check Log Level Range
        if (typeof levelNames[option.level] == 'undefined')
            throw new Error('Log level is wrong');
        // Open New Stream
        if (this.stream[option.level] == null) {
            mkdir_recursive_1.default.mkdirSync(path_1.default.join(this.logPath, "/" + levelNames[option.level]));
            this.stream[option.level] = fs_1.default.createWriteStream(path_1.default.join(this.logPath, "/" + levelNames[option.level] + "/" + this.logTime + "." + this.ext), { flags: 'a' });
        }
        // Apply Log Format
        var logText = input;
        if (!option.noFormat && this.logFormat)
            logText = this.logFormat(logText, option.level, this);
        // Append Log Text
        if (!option.noWrite) {
            // Remove ANSI
            var clearedText = strip_ansi_1.default(logText);
            // Remove some escape sequences
            clearedText = clearedText.replace(/[\t\b]/gi, '') + "\n";
            var dataStream = this.stream[option.level];
            if (dataStream != null)
                dataStream.write(clearedText);
        }
        // Print Log Text
        if (!isNaN(Number(this.showLevel)) && Number(this.showLevel) >= Number(option.level)) {
            if (!option.noPrint) {
                if (option.noFormat) {
                    process.stdout.write(logText);
                }
                else {
                    console.log(logText);
                }
            }
        }
        return this;
    };
    FolderLogger.prototype.setLogPath = function (_logPath) {
        mkdir_recursive_1.default.mkdirSync(_logPath);
        this.logPath = _logPath;
        this.checkRefresh();
        return this;
    };
    FolderLogger.prototype.checkRefresh = function () {
        var newLogTime = moment_1.default(this.momentOption).format(this.timeFormat);
        if (this.logTime != newLogTime) {
            // Refrash Log Time
            this.logTime = newLogTime;
            // Close Before Stream
            this.close();
        }
        return this;
    };
    FolderLogger.prototype.close = function () {
        // Close Before Stream
        for (var i = 0; i <= 5; i++) {
            var dataStream = this.stream[i];
            if (dataStream != null) {
                dataStream.end();
                dataStream = null;
            }
        }
    };
    return FolderLogger;
}());
exports.FolderLogger = FolderLogger;
exports.default = FolderLogger;
