window.onload = () => {
  class Sinkei {
    constructor() {
      this.initialGame();
    }

    initialGame() {
      this.turnCount = 0;
      this.pairCount = 0;
      this.firstTurnCard;
      this.timeLimit = { s: 60, ms: 0 };
      this.missCount = 0;
      this.score = 0;
      this.isSecond = false;
      this.wait = false;
      this.deck = this.shuffleCards(this.createCards());
      this.overlay = document.querySelector(".overlay");
      this.overlayContent = document.querySelector(".overlayContent");
      this.distributeCards(this.deck);
      this.viewLimit();
      this.viewPairCount();
      this.overlayContent.innerHTML = "";
      const gameTitle = this.createEle("div", {
        classList: ["title", 'result'],
        text: 'PAiRS'
      })
      const startBtn = this.createEle("div", {
        classList: ["startBtn"],
        eventList: {
          click: () => this.startGame()
        },
        text: "START"
      });
      this.overlayContent.appendChild(gameTitle);
      this.overlayContent.appendChild(startBtn);
    }

    startGame() {
      this.hideOverlay();
      const limit = setInterval(() => {
        if (this.timeLimit.ms === 0) {
          this.timeLimit.ms = 99;
          this.timeLimit.s--;
          this.viewLimit();
          return;
        }
        this.timeLimit.ms--;
        this.viewLimit();
        if (this.timeLimit.s === 0 && this.timeLimit.ms === 0) {
          clearInterval(limit);
          document.querySelector("#timeLimit").style.color = "";
          this.endGame();
        }
      }, 10);
    }

    showOverlay() {
      this.overlay.style.display = "block";
    }

    hideOverlay() {
      this.overlay.style.display = "none";
    }

    async endGame() {
      this.overlayContent.innerHTML = "";
      const endTitle = this.createEle("div", {
        classList: ["title", "result"],
        text: "終了"
      });
      this.overlayContent.appendChild(endTitle);
      this.showOverlay();

      await this.timeOut(1000);

      const resultPairCnt = this.createEle("div", {
        classList: ["resultPairCnt", "result"],
        html: `${this.pairCount}<span class="unit">pair</span>`
      });
      this.overlayContent.appendChild(resultPairCnt);

      await this.timeOut(500);

      const missCnt = this.createEle("div", {
        classList: ["missCnt", "result"],
        html: `${this.missCount}<span class="unit">回</span>`
      });
      this.overlayContent.appendChild(missCnt);
      await this.timeOut(500);
      this.score = this.pairCount * (1000 - this.missCount * 9);
      const score = this.createEle("div", {
        classList: ["score", "result"],
        html: `<span class="unit">score<br></span>0`
      });
      this.overlayContent.appendChild(score);
      let scoreCnt = 0;
      const scoreLoop = setInterval(() => {
        if (scoreCnt >= this.score || this.score === 0) {
          clearInterval(scoreLoop);
          score.innerHTML = `<span class="unit">score<br></span>${this.score}`;
          const restartBtn = this.createEle("div", {
            classList: ["restartBtn"],
            eventList: {
              click: () => this.initialGame()
            },
            text: "Re:ゼロから始める"
          });
          this.overlayContent.appendChild(restartBtn);
        } else {
          scoreCnt += 9;
          score.innerHTML = `<span class="unit">score<br></span>${scoreCnt}`;
        }
      }, 1);
    }

    viewLimit() {
      const s = String(this.timeLimit.s).padStart(2, "0");
      const ms = String(this.timeLimit.ms).padStart(2, "0");
      const timeLimitEle = document.querySelector("#timeLimit");
      if (this.timeLimit.s < 4) {
        timeLimitEle.style.color = "red";
      }
      timeLimitEle.innerText = `${s}:${ms}`;
    }

    viewPairCount() {
      document.querySelector("#pairCount").innerText = this.pairCount;
    }

    createCards() {
      let cards = [];
      for (let i = 1; i <= 10; i++) {
        cards.push({ type: "spade", num: i });
        cards.push({ type: "heart", num: i });
      }
      return cards;
    }

    shuffleCards(cards) {
      for (let i = cards.length - 1; i >= 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[rand]] = [cards[rand], cards[i]];
      }
      return cards;
    }

    distributeCards(deck) {
      document.querySelector(".field").innerHTML = "";
      for (const card of deck) {
        const front = this.createEle("div", {
          classList: [card.type, "front", "card"],
          text: card.num
        });
        const flipped = this.createEle("div", {
          classList: ["flipped", "card"]
        });

        const board = this.createEle("div", {
          classList: ["board", "left"],
          childList: [front, flipped],
          eventList: {
            click: e => {
              if (this.wait) {
                return;
              }
              const classList = e.target.parentNode.classList;
              if (classList.contains("active")) {
                return;
              }
              this.incrementCount();
              e.target.parentNode.classList.add("active");
              const frontEle = e.target.previousElementSibling;
              if (!this.isSecond) {
                this.isSecond = true;
                this.firstTurnCard = frontEle;
                return;
              }
              this.isSecond = false;
              if (frontEle.innerText !== this.firstTurnCard.innerText) {
                this.firstTurnCard = undefined;
                const activeCardList = document.querySelectorAll(".active");
                this.wait = true;
                setTimeout(() => {
                  for (const activeCard of activeCardList) {
                    if (!activeCard.classList.contains("close")) {
                      activeCard.classList.remove("active");
                    }
                  }
                  this.missCount++;
                  this.wait = false;
                }, 300);
                return;
              }
              this.wait = true;
              setTimeout(() => {
                frontEle.style.opacity = ".3";
                frontEle.parentNode.classList.add("close");
                this.firstTurnCard.style.opacity = ".3";
                this.firstTurnCard.parentNode.classList.add("close");
                this.firstTurnCard = undefined;
                this.pairCount++;
                this.viewPairCount();
                this.wait = false;
              }, 300);
            }
          }
        });

        document.querySelector(".field").appendChild(board);
      }
    }

    incrementCount() {
      this.turnCount++;
    }

    createEle(eleType, option) {
      let ele = document.createElement(eleType);
      if (!option) {
        return ele;
      }

      if (option.id) {
        ele.id = option.id;
      }

      if (option.classList && option.classList.length) {
        for (let i = 0, max = option.classList.length; i < max; i++) {
          ele.classList.add(option.classList[i]);
        }
      }

      if (option.attrList) {
        for (let key in option.attrList) {
          ele.setAttribute(key, option.attrList[key]);
        }
      }

      if (option.styleList) {
        for (let key in option.styleList) {
          ele.style[key] = option.styleList[key];
        }
      }

      if (option.childList) {
        for (let i = 0, max = option.childList.length; i < max; i++) {
          ele.appendChild(option.childList[i]);
        }
      }

      if (option.text) {
        ele.innerText = option.text;
      }

      if (option.html) {
        ele.innerHTML = option.html;
      }

      if (option.eventList) {
        for (let key in option.eventList) {
          ele.addEventListener(key, option.eventList[key]);
        }
      }
      return ele;
    }

    timeOut(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
  }

  new Sinkei();
};
