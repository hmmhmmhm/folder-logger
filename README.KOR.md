<img src="https://i.imgur.com/Odmf7O5.png" alt="icon" width="128"/>

# Folder-Logger

> **간편한** 로그 기록 관리,
>
> **중요도**에 따른 폴더에 따른 분류
>
> **날짜와 시간**에 따른 파일 자동 분류
>
> **이쁜** 기본 텍스트 포멧팅

Node.js 에서 쉽게 사용할 수 있는 로거 모듈입니다.



## 사용모습

Folder-Logger 는 모든로그에 이븐 텍스트 포멧팅을 적용시키는 기본 기능을 가지고 있습니다.  이 기능은 이용자 필요에 따라 커스터마이징 될 수 있으며, 포멧팅을 끄거나, 콘솔엔 표시되지 않고 파일에만 기록되게 처리할 수도 있습니다.

### Bash 사용예

Windows, Mac 에서 Bash 사용시 보여지는 모습입니다. 가급적 Bash 기반 콘솔을 이용할 것을 권장합니다.

![](https://i.imgur.com/Qsjl5iz.png)

### Windows CMD 사용예

Folder-Logger 의 기본 텍스트 포멧팅은 어떠한 변형도 없는 Windows 기본 CMD 도 고려하여 구성되어있습니다.

![](https://i.imgur.com/oEexOjH.png)

### 폴더로 분류된 로그 데이터 예

![](https://i.imgur.com/tjjQCf1.png)

Folder-Logger 는 로그 중요도에 로그를 분류해서 각기 다른 폴더에 저장합니다. 이렇게 저장되는 폴더는 날짜에 따라서 저장되므로, 찾고 있는 중요도와 날짜와 시간에 해당하는 로그를 어떠한 에디터에서든 플러그인 또는 검색없이 물리적 폴더 및 파일 분류로 쉽게 찾을 수 있습니다.

### 저장되는 로그 데이터 예

![](https://i.imgur.com/Bv3Nrzs.png)

텍스트에 어떠한 ANSI 컬러를 사용하거나 특수문자를 사용해도, 로그상에서 깨지지 않고 콘솔에서 표시된 Unicode 가 깔끔하게 시간과 함께 정리됩니다. 저장되는 로그형태는 이용자가 직접 커스터마이징 할 수 있으며, 이러한 로그 포멧팅은 로그에 따라 자유롭게 끄고 켤 수 있습니다.



## 사용 방법

### 모듈 설치

```bash
npm install --save folder-logger
```

### 로거 생성

로그를 저장할 폴더경로를 미리 만들거나, 로그파일을 새로 만들 필요는 없습니다. 지정된 폴더경로내 폴더 계층이 없는 경우 폴더를 생성하며, 로그 파일도 자동으로 생성합니다. (또한 프로그램이 다시 켜지더라도 로그가 초기화되는 현상 없이 연속된 로그 작성이 이뤄집니다.)

```javascript
// ES5
const FolderLogger = require('folder-logger')

// 로그를 저장할 폴더위치
const path = `${__dirname}/logs/`

// 로거 인스턴스 생성
const logger = new FolderLogger(path)
```

### 로거 메시지 전송

```javascript
var message = `Lorem ipsum dolor sit amet`

// 기본 안내 메시지를 출력합니다.
logger.info(message)

// 시스템 메시지를 출력합니다.
logger.system(message)

// 주의 메시지를 출력합니다.
logger.warn(message)

// 오류 메시지를 출력합니다.
logger.error(message)

// 치명적 오류 메시지를 출력합니다.
logger.critical(message)

// 디버깅용 메시지를 출력합니다.
logger.debug(message)
```

### 로거 레벨 분류

Folder-Logger 의 로그 분류는 총 6가지이며, 이 6가지 분류엔 0~5까지의 중요도 분류가 존재합니다.

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

위와 같은 `level` 객체는 아래와 같은 방법으로 로거 상에서 언제든 가져올 수 있습니다.

```javascript
// 위의 level 객체를 반환합니다.
logger.level()

// level 객체의 key 값들을 반환합니다.
logger.levelNames()
```

### 로거 레벨 설정

Folder-Logger 에는 콘솔에 표시되는 로그 메시지의 레벨을 설정할 수 있는 기능이 있습니다. 가령 `3`을 설정한 경우, `3` 보다 더 큰 레벨의 로그는 콘솔 상에 표시되지 않습니다. 설정된 로그 레벨과 상관없이 파일 상에는 정상적으로 모든 로그가 기록 됩니다. (기본적으로 설정된 로거 레벨은 `5`입니다.)

```javascript
// 이 경우 debug 메시지를 표시하지 않게 됩니다.
logger.setLevel(4)

// 이 경우 info 메시지 만을 표시하게 됩니다.
logger.setLevel(0)
```



## 고급 사용 방법

### 로거 메시지 옵션 적용

```javascript
logger.info(`Hello?`, {
    noPrint: false, // 기본 false
    noWrite: false // 기본 false
    noFormat: false, // 기본 false
})
```

옵션은 `info`, `system`, `warn`, `error`, `critical`, `debug` 모든 함수에 동일하게 2번째 인자 객체로 구성할 수 있습니다. 아래에서 해당 옵션 요소들을 설명합니다.

#### noPrint <boolean>

해당 옵션이 `true` 로 처리되면 콘솔상에 해당 메시지가 출력되지 않습니다.  해당 옵션을 이용해서 화면엔 표시되지 않고 파일상에만 기록되는 로그메시지를 구현할 수 있습니다.

#### noWrite <boolean>

해당 옵션이 `true` 로 처리되면 파일 상에 해당 메시지가 기록되지 않습니다.  해당 옵션을 이용해서 화면에만 표시되고 파일상에는 기록되지 않는 로그메시지를 구현할 수 있습니다.

#### noFormat <boolean>

해당 옵션이 `true` 로 처리되면 해당 메시지에 기본 텍스트 포멧팅을 적용하지 않습니다. 이는 파일에 저장되는 메시지와 콘솔 상에 표시되는 모든 메시지에 동일합니다. <u>이 옵션을 사용한채로 로그를 저장하게 되면 해당 메시지가 발생한 시간이 기록되지 않으므로 주의해서 사용해합니다.</u>

### 로거 메시지 저장위치 변경

아래 함수를 이용해서 모듈이 실행 중에 로거 메시지의 저장 위치를 변경할 수 있습니다. 기존 로그 파일은 자동으로 알아서 닫히며 로그 폴더 경로가 존재하지 않는 경우 자동으로 폴더계층과 파일이 생성됩니다.

```javascript
// 새롭게 로그를 저장할 폴더 위치
const path = `${__dirname}/logs/`

// 로그 저장위치를 변경합니다.
logger.setLogPath(path)
```

### log 함수 이용

함수명을 레벨 분류에 따라 다르게 사용하고 싶지 않은 경우, 아래와 같이 log 함수를 사용하면서 옵션으로 로그 레벨을 지정해줄 수도 있습니다. (로그 레벨을 지정하지 않은 경우 `info`  레벨이 자동으로 적용됩니다.)

```javascript
logger.log({
    level: logger.level.info // 0~5으로도 입력가능합니다.
})
```



## 커스터마이징 방법

### 로그파일 확장자 변경

기본적으로 저장되는 로그파일 확장자는 `.log` 입니다. 다른 확장자명을 사용하길 원하는 경우 이를 로거 인스턴스 생성시 2번째 인자 객체로 지정할 수 있습니다.

```javascript
// 로거 인스턴스 생성
const logger = new FolderLogger(path, {
    ext: `txt` // 이 경우 .txt 확장자로 저장됩니다.
})
```

### 로그파일 시간포멧팅 변경

Folder-Logger 에서 로그파일에 사용되는 시간 포멧팅은 `moment.js` 모듈에 의존하고 있으며,  `moment.js` 에서 호환하는 날짜포멧팅으로 자유롭게 변형할 수 있습니다. 즉 문자열 형태로 날짜 형태를 지정할 수 있습니다. 기본적으로 지정된 날짜 포멧팅은 `YYYY-MM-DD` 입니다.

```javascript
// 로거 인스턴스 생성
const logger = new FolderLogger(path, {
    timeFormat: `YYYY-MM-DD` // 예: 2019-02-06
})
```

### 로그파일 시간포멧팅에 moment.js 옵션 적용

Folder-Logger 사용 중 타임존 설정 등 `moment(/* 여기 */)` 형태에 직접 사용해야하는 `moment.js` 옵션이 존재한다면 다음과 같이 적용가능합니다.

```javascript
// 로거 인스턴스 생성
const logger = new FolderLogger(path, {
    momentOption: `2090-11-11T11:11:11`
})
```

### 로그 텍스트 포멧팅 변경

Folder-Logger 의 커스터마이징시 사용되는 텍스트 포멧팅은 이용자에 의해 자유롭게 커스터마이징 될 수 있습니다. 사용방법은 다음과 같습니다.

```javascript
// 포멧팅 시 사용 할 색상표현 모듈입니다.
const chalk = require('chalk')

// 포멧팅 함수 (기본함수를 예시로 동봉합니다.)
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

// 로거 인스턴스 생성
const logger = new FolderLogger(path, {
    logFormat: myLogFormat
})
```



## 로고 아이콘 출처

<div>Icons made by <a href="https://www.flaticon.com/authors/smalllikeart" title="smalllikeart">smalllikeart</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>



## License

MIT Licensed.
