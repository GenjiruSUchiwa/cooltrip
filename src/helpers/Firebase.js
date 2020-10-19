import auth from "@react-native-firebase/auth"
import Modal from "./Modal"

let confirmation = null
let onAuthStateChanged = null

export default {
  onAuthStateChanged(callback) {
    onAuthStateChanged = callback
    auth().onAuthStateChanged(onAuthStateChanged)
  },
  triggerAuthStateChanged(user) {
    onAuthStateChanged(user)
  },
  auth(phoneNumber, loader = true) {
    if (loader)
      Modal.fetching.show()

    return new Promise((resolve, reject) => {
      auth().signInWithPhoneNumber(phoneNumber)
        .then(confirmResult => {
          confirmation = confirmResult
          resolve(confirmResult)
        })
        .catch(reject)
        .then(() => loader ? Modal.fetching.hide() : null)
    })
  },
  confirm(code, loader = true) {
    if (loader)
      Modal.fetching.show()

    return new Promise((resolve, reject) => {
      confirmation.confirm(code)
        .then(resolve)
        .catch(reject)
        .then(() => loader ? Modal.fetching.hide() : null)
    })
  },
  logout(loader = true) {
    if (loader)
      Modal.fetching.show()

    return new Promise((resolve, reject) => {
      auth().signOut()
        .then(resolve)
        .catch(reject)
        .then(() => loader ? Modal.fetching.hide() : null)
    })
  }
}
