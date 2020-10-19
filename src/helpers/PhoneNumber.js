import { parsePhoneNumberFromString } from "libphonenumber-js"


export default {
  split(phone_number) {
    let parsed = parsePhoneNumberFromString(phone_number)
    if (!parsed)
      return {
        code: null,
        number: null
      }

    return {
      code: '+' + parsed.countryCallingCode,
      number: parsed.nationalNumber
    }
  }
}
