const electron = require('electron')
const path = require('path')

const Notification = electron.remote.Notification

class Noti extends Notfication {
  constructor(settings){
    super(settings)
  }
 
  // showNotification () {
  //   new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
  // }

}

module.exports = Noti
