import React from "react"
import {DatePickerAndroid} from "react-native"
import {to2Digits} from "./"

export default {
  make(day, month, year) {
    day = to2Digits(day)
    month = to2Digits(month + 1)
    year = to2Digits(year)

    return {
      iso: year + '-' + month + '-' + day,
      fr: day + '/' + month + '/' + year,
    }
  },
  fromIso(isoDate) {
    if (!isoDate)
      return {}

    const date = typeof isoDate === "string" ? new Date(isoDate) : isoDate
    return this.make(date.getDate(), date.getMonth(), date.getFullYear())
  },
  today() {
    return this.fromIso(new Date())
  },
  isoToFr(isoDate) {
    if (!isoDate)
      return isoDate

    if (isoDate === this.today().iso)
      return "Aujourd'hui"

    const parts = isoDate.split('-')
    return parts[2] + '/' + parts[1] + '/' + parts[0]
  },
  frToIso(frDate) {
    if (!frDate)
      return frDate

    const parts = frDate.split('/')
    return parts[2] + '-' + parts[1] + '-' + parts[0]
  },
  promptDate(defaultDate, minDate) {
    const settings = {}
    if (defaultDate)
      settings.date = defaultDate
    if (minDate)
      settings.minDate = minDate

    return DatePickerAndroid
      .open(settings)
      .then(({action, year, month, day}) => {
        if (action === DatePickerAndroid.dismissedAction)
          return null

        return this.make(day, month, year)
      })
  }
}
