const { ipcRenderer } = require('electron')
// TODO: make this a class


class Timer {
  constructor(mode){
   // Defaulting to 25min here, can also be passed in in future
    this.sessionLength = 1
    this.playing = false
    this.tleft = null
    this.mode = mode
    this.timerId = null
  }

  counter() {
    if(!this.playing){
      clearInterval(this.timerId)
      return
    }
    if(this.tleft == null){
      this.tleft = this.sessionLength * 60 * 1000
    }
    this.timerId = setInterval(() => {
      if (this.playing === true) {
        this.tleft -= 1000
        const min = Math.floor(this.tleft / (60 * 1000))
        const sec = Math.floor((this.tleft - (min * 60 * 1000)) / 1000)

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
  }

  startFocusTimer() {
    this.mode = "focus"
    this.sessionLength = 1
    this.startTimer()
  }
  startBreakTimer() {
    this.mode = "break"
    this.sessionLength = 0.5
    this.startTimer()
  }

  stopTimer() {
    this.tleft = null
    clearInterval(this.timerId)
    this.timerId = null
    this.playing = false
  }
  isPlaying () {
    return this.playing
  }

// TODO: doesn't work yet but would be easiest to just have one toggle play/stop function that can be called from one button to ensure we can not start several processes
  togglePlay () {
    if(this.playing = true){
      this.stopTimer()
    } else {
      this.startTimer()
    }
    console.log("toggle state of play button from inside timer");
  }

  _renderTLeft (minutes, seconds) {
    document.querySelector("#minLeftId").innerHTML = minutes;
    document.querySelector("#secLeftId").innerHTML = seconds;
    console.log(`time left ${minutes} : ${seconds}`);
    return
  }
}

module.exports = Timer
