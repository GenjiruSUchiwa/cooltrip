import Config from "react-native-config"
import PhoneNumberHelper from "./PhoneNumber"
import ModalHelper from "./Modal"

export const PhoneNumber = PhoneNumberHelper
export const Modal = ModalHelper

export const env = (key, defaultValue) => Config[key] || defaultValue

export const appDebug = env("APP_DEBUG") === "true"

export const getErrorMessage = (error = {}, defaultMessage) => appDebug || error.statusCode
  ? error.message
  : defaultMessage || "Problème de connexion au serveur.\nVérifiez votre connexion internet et réessayez."

export const requestErrorHandler = error => ModalHelper.feedback.show({
  type: "error",
  title: "OUPS !",
  message: getErrorMessage(error)
})

export const truncate = (str, max) => {
  if (str === undefined || str === null || str.length <= max)
    return str

  return str.substr(0, max - 2) + '...'
}

//http://phpjs.org/functions/chunk_split:369
function chunk_split(body, chunklen, end) {
  // Returns split line
  //
  // version: 1103.1210
  // discuss at: http://phpjs.org/functions/chunk_split
  // +   original by: Paulo Freitas
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Theriault
  // *     example 1: chunk_split('Hello world!', 1, '*');
  // *     returns 1: 'H*e*l*l*o* *w*o*r*l*d*!*'
  // *     example 2: chunk_split('Hello world!', 10, '*');
  // *     returns 2: 'Hello worl*d!*'
  chunklen = parseInt(chunklen, 10) || 76;
  end = end || '\r\n';

  if (chunklen < 1) {
    return false;
  }

  return body.match(new RegExp(".{0," + chunklen + "}", "g")).join(end);
}

const strrev = str => str.split("").reverse().join("")
const ltrim = (str, char = ' ') => str.replace(new RegExp(`^${char}+`, "g"), '')

export const formatAmount = amount => {
  if (parseFloat(amount) === 0)
    return 0

  amount += ''

  return strrev(chunk_split(strrev(ltrim(amount, '0')), 3, ' ')).trim()
}

export const formatPhoneNumber = phoneNumber => {
  if (!phoneNumber)
    phoneNumber = ""

  return strrev(chunk_split(strrev(phoneNumber), 2, ' ')).trim()
}

export const to2Digits = int => int < 10 ? '0' + int : int

export const getDeepValue = (obj, path) => {
  path = path.split(".")
  let value = obj
  for (let i = 0; i < path.length; i++)
    if (value && value.constructor === {}.constructor)
      value = value[path[i]]
    else {
      value = undefined
      break
    }

  return value
}

export const formatGender = (gender, fallback) => gender === "M" ? "M." : gender === "F" ? "Mme" : fallback
export const formatGenderFull = (gender, fallback) => gender === "M" ? "Homme" : gender === "F" ? "Femme" : fallback
export const logo = path => path ? {uri: path} : require("../assets/images/logos/cooltrip.png")
