export default {
  isValidPhoneNumber(str) {
    str += ''
    return !!str.match(/^(00|\+)?[0-9]{6,16}$/)
    // return !!str.match(/^((00|\+)?237)?6[0-9]{8}$/)
  },
  isValidEmail(str) {
    str += ''
    return !!str.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
  },
  isValidDate(str) {
    return true
  }
}
