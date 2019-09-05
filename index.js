const bgColorCmd = 'bgc'
const bgImageCmd = 'bgi'
const autoNextCmd = 'next'
const sceneCmd = 'scene'
const selectCmd = 'select'
const textCmd = 'text'


class Reader {
    constructor() {
        this.scenarioData = []
        this.currentScene = 'default'
        this.currentLine = -1
        this.selectHistory = []
        this.isSelectNow = false
        this.getScenario()
        this.preview()
        document.querySelector('.textView').addEventListener('click', event => {
            if (this.isSelectNow) {
                return
            }
            this.moveOnLine()
        })
    }

    preview() {
        const mock = "#default\n@@@cmd bgi::https://cdn.r-adimg.com/5e/f3/10032584_0_5e5a8aaa3a59ab1e08d5fd3b5248ea44.jpg next\n【主人公】@@nl@@(俺の名前は吉田優。@@nl@@今日から株式会社Respawnで働くことになった！)\n【吉田優】@@nl@@おはようございます！！！！\n【一同】@@nl@@(何だこのうるせーやつ・・・)\n@@@cmd next text::【吉田優】@@nl@@(やべっ、誰も反応してくれない、、、どうしよう)\n@@@cmd select::もう一度挨拶する,とりあえず立ってる,皆殺し::def-q1-answer1,def-q1-answer2,def-q1-answer3\n\n#def-q1-answer1\n【吉田優】@@nl@@お・は・よ・う・ご・ざ・い・ま・す！！！！！！！！！\n【厳つい男】@@nl@@朝っぱらからうるせーよ！！！！！\n【吉田優】@@nl@@いやいや！挨拶ぐらいちゃんとしましょうよ！！\n【吉田優】@@nl@@いい大人なんすから、中坊みたいな事言ってないで！\n@@@cmd scene::stage1 next\n\n#def-q1-answer2\n【吉田優】@@nl@@・・・・・・・・・\n【厳つい男】@@nl@@突っ立ってるなら帰れ。目障りだ。\n【吉田優】@@nl@@いや、、、でも、、、今日からこの会社に入社するんで\n@@@cmd scene::stage1 next\n\n#def-q1-answer3\n【吉田優】@@nl@@あははははははは！！！！！！！！\n【吉田優】@@nl@@挨拶もまともにできねえ社会のゴミは消えてなくなれー\n【吉田優】@@nl@@ビックバンアターック！！！！！！！\n@@@cmd scene::stage2 next\n\n\n\n\n#stage1\n@@@cmd bgi::https://www.jalan.net/jalan/doc/top/top_image/map/top_bg_02.png next\n@@@cmd next text::あなたは@@space@@天使ですか？\n@@@cmd select::はい！,いいえ、、、,神です::default,stage1,stage2\n\n#stage2\nEND"
        const lineArr = this.parseNewLine(mock.split(/\r\n|\r|\n/))
        let scene = ''
        const data = lineArr.reduce((acc, cur) => {
            if (cur === '') {
                return acc
            }
            const partsArr = cur.split(' ')
            const lineData = {}
            switch (true) {
                case /^(@@@cmd)$/.test(partsArr[0]):
                    lineData.cmdList = []
                    for (let i = 1, max = partsArr.length; i < max; i++) {
                        const cmdParts = partsArr[i].split('::')
                        switch (cmdParts[0]) {
                            case bgColorCmd:
                                lineData.color = cmdParts[1]
                                break
                            case bgImageCmd:
                                lineData.imageUrl = cmdParts[1]
                                break
                            case sceneCmd:
                                lineData.scene = cmdParts[1]
                                break
                            case selectCmd:
                                lineData.selectList = cmdParts[1].split(',')
                                lineData.selectSceneList = cmdParts[2].split(',')
                                break
                            case textCmd: lineData.text = cmdParts[1].replace(/@@space@@/g,' ')

                        }
                        lineData.cmdList.push(cmdParts[0])
                    }
                    break
                case /(#\.*)/.test(partsArr[0]):
                    scene = partsArr[0].slice(1)
                    return acc
                default:
                    lineData.text = partsArr.join(' ')

            }

            if (!acc[scene]) {
                acc[scene] = []
            }
            acc[scene].push(lineData)
            return acc
        }, [])
        return data
    }

    async getScenario() {
        const data = this.preview()
        this.scenarioData = data
    }

    moveOnLine() {
        this.currentLine++
        this.processing()
    }

    moveOnScene(targetScene) {
        this.currentScene = targetScene
        this.currentLine = -1
    }

    readLine() {
        return this.scenarioData[this.currentScene][this.currentLine]
    }

    processing() {
        const nowReadLine = this.readLine()
        if (!nowReadLine) {
            console.error(`${this.currentScene}シーンの続きがありません。`)
            return
        }
        if (nowReadLine.text) {
            this.changeText(nowReadLine.text)
        }
        if (!nowReadLine.cmdList) {
            return
        }
        for (const cmd of nowReadLine.cmdList) {
            switch (cmd) {
                case bgColorCmd:
                    BackgroundLogic.changeColor(nowReadLine.color)
                    break
                case bgImageCmd:
                    BackgroundLogic.changeImage(nowReadLine.imageUrl)
                    break
                case autoNextCmd:
                    this.moveOnLine()
                    break
                case sceneCmd:
                    this.moveOnScene(nowReadLine.scene)
                    break
                case selectCmd:
                    for (let i = 0, max = nowReadLine.selectList.length; i < max; i++) {
                        this.createSelectBtn(nowReadLine.selectList[i], nowReadLine.selectSceneList[i], i + 1)
                    }
                    break
            }
        }

    }

    changeText(txt) {
        document.querySelector('.textView').innerHTML = txt
    }

    createSelectBtn(selectTxt, nextScene, selectNum) {
        this.isSelectNow = true
        const btn = document.createElement('div')
        btn.classList.add('selectButton')
        btn.innerText = selectTxt
        btn.addEventListener('click', () => {
            this.selectHistory.push(selectNum)
            this.resetSelectWindow()
            this.isSelectNow = false
            if (nextScene) {
                this.moveOnScene(nextScene)
                this.moveOnLine()
            }
        })
        document.querySelector('.selectWindow').appendChild(btn)
    }

    resetSelectWindow() {
        document.querySelector('.selectWindow').innerHTML = ''
    }

    parseNewLine(lineArr) {
        return lineArr.reduce((prev, item) => {
            prev.push(item.replace(/@@nl@@/g,'<br>'))
            return prev
        }, [])
    }

    endScenario() {

    }
}

new Reader()

class BackgroundLogic {
    static changeColor(bgc) {
        document.querySelector('.gameDisplay').style.backgroundColor = bgc
    }

    static changeImage(bgi) {
        document.querySelector('.gameDisplay').style.backgroundImage = `url(${bgi})`
    }
}