const { ipcRenderer } = require('electron')
// import env from "env"
const env = require('env')

class Timer {
  constructor(mode){
    // Defaulting to 25min here, can also be passed in in future
    console.log(env.name)
    this.sessionLength = env.focusDur
    this.playing = false
    this.tleft = null
    this.mode = mode
    this.timerId = null
    this._renderTLeft()
  }

  counter() {
    if(!this.playing){
      clearInterval(this.timerId)
      return
    }
    if(this.tleft == null){
      this.tleft = this.sessionLength * 60 * 1000
    }
    let fullMinute
    this.timerId = setInterval(() => {
      if (this.playing === true) {
        this.tleft -= 1000
        const min = Math.floor(this.tleft / (60 * 1000))
        const sec = Math.floor((this.tleft - (min * 60 * 1000)) / 1000)

        if ((this.tleft /1000) % 60 === 0) {
          ipcRenderer.send('FullMinute')
        }

        // tleft gows below 0
        // stop the timer
        // send message to the main process
        if (this.tleft <= 0) {
          this.stopTimer()
          if (this.mode === 'focus') {
            ipcRenderer.send('FocusComplete')
          } else if (this.mode === 'break') {
            ipcRenderer.send('BreakComplete')
          }
        } else if (this.tleft === 5000) {
          // if counter has left with 5 second
          // notify the user for that
          this._renderTLeft(min, sec)
          ipcRenderer.send('FiveSecondEarlyAlert', this.mode)
        } else {
          this._renderTLeft(min, sec)
        }
      }
    }, 1000)
  }

  startTimer() {
    this.playing = true
    this.counter()
    this.disableStop()
  }

  startFocusTimer() {
    this.mode = "focus"
    this.sessionLength = env.focusDur
    this.startTimer()
  }
  startBreakTimer() {
    this.mode = "break"
    this.sessionLength = env.breakDur
    this.startTimer()
  }

  stopTimer() {
    this.tleft = null
    clearInterval(this.timerId)
    this.timerId = null
    this.playing = false
    this.disableStart()
  }

  disableStop(){
    document.querySelector("#stopBtnId").removeAttribute('disabled')
    document.querySelector("#startBtnId").setAttribute('disabled', true)
  }
  disableStart(){
    document.querySelector("#startBtnId").removeAttribute('disabled')
    document.querySelector("#stopBtnId").setAttribute('disabled', true)
  }

  _renderTLeft (minutes, seconds) {
    if (isNaN(seconds)) {
      document.querySelector("#minLeftId").innerHTML = '25'
      document.querySelector("#secLeftId").innerHTML = '00'
      this.circle()
      return
    }
    document.querySelector("#minLeftId").innerHTML = minutes
    document.querySelector("#secLeftId").innerHTML = seconds
    // console.log(`time left ${minutes} : ${seconds}`)
    this.circle(minutes, seconds)
    return
  }

  circle(minutes, seconds){
    // stroke dash offset: 0 (=100% filled) and counts up to strokeMax (=0% filled)
    const circle = document.getElementById('bar')
    const strokeMax = Math.PI*(circle.getAttribute('r')*2)

    let strokeRelative
    if (isNaN(seconds)) {
      strokeRelative = strokeMax
    }
    else{
      const secTotal = this.sessionLength * 60
      const secRemain = minutes*60+seconds
      strokeRelative = secRemain/secTotal*strokeMax

    }
    circle.setAttribute('stroke-dashoffset', strokeRelative)
    circle.setAttribute('stroke-dasharray', strokeMax)
  }
}

module.exports = Timer
