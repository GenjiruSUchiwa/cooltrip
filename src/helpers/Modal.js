import EventEmitter from "react-native-eventemitter"

const modals = ['fetching', 'feedback']

class Modal {
  constructor(type) {
    this.type = type
  }

  show(arg) {
    EventEmitter.emit(`modal.${this.type}.show`, arg)
  }

  hide() {
    EventEmitter.emit(`modal.${this.type}.hide`)
  }
}

export default Object.fromEntries(modals.map(item => [
  item, new Modal(item)
]))
