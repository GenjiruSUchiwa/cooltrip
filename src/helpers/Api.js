import {env} from "./"
import Modal from "./Modal"
import Storage from "./Storage"

const userHost = env("MS_USER_HOST")
const bookingHost = env("MS_BOOKING_HOST")

export const StatusCodes = {
  advert: {
    EXPIRED: "CA03",
    SUCCEEDED: "CB03",
  }
}

export const Routes = {
  user: {
    RETRIEVE: userHost + "/api/users/phone/details",
    REGISTER: userHost + "/api/users",
    UPDATE: userHost + "/api/users/{{uiid}}",
  },
  booking: {
    SEARCH: bookingHost + "/api/advert/search/{{startCity}}/{{endCity}}/{{seats}}/{{date}}",
    INIT: bookingHost + "/api/booking",
    CREATE: bookingHost + "/api/booking/{{bookingUuid}}",
    PROCEED_PAYMENT: bookingHost + "/api/transaction",
    USER_BOOKINGS: bookingHost + "/api/user/bookings",
  },
  payment: {
    SUCCESS: "https://thecooltrip.com/cooltrip/checkout/payment/success",
    ERROR: "https://thecooltrip.com/cooltrip/checkout/payment/error",
    CANCEL: "https://thecooltrip.com/cooltrip/checkout/payment/canceled",
  },
  links: {
    WEBSITE: "https://thecooltrip.com",
    POLICY: "https://thecooltrip.com",
  },
  community: {
    FACEBOOK: "https://www.facebook.com/CoolTripCameroun",
    TWITTER: "https://twitter.com/cooltrip_cmr",
    INSTAGRAM: "https://www.instagram.com/cooltrip_237",
    WHATSAPP: "https://wa.me/237" + env("SUPPORT_PHONE"),
  },
  support: {
    PHONE: env("SUPPORT_PHONE"),
    EMAIL: env("SUPPORT_EMAIL")
  },
  sponsorship: {
    TITLE: "",
    MESSAGE: "Cool !\nTélécharge l'application CoolTrip et réserve tes tickets de bus sans te déplacer.\n" + env("APP_URL")
  }
}

export default {
  get(route, params, loader = true) {
    return this.request("GET", route, params, {}, loader)
  },
  post(route, data, params = {}, loader = true) {
    return this.request("POST", route, params, data, loader)
  },
  put(route, data, params = {}, loader = true) {
    return this.request("PUT", route, params, data, loader)
  },
  request(method = "", route = "", params = {}, data = {}, loader = true) {
    if (loader)
      Modal.fetching.show()

    const req = {
      method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    }
    if (method !== "GET" && method !== "HEAD")
      req.body = JSON.stringify(data)

    if (params) {
      let i = 0
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          route += (!i ? '?' : '&') + `${key}=${params[key]}`
          i++
        }
      }
    }

    let url = route
    const matches = url.match(/{{[a-zA-Z0-9_]+}}/g)
    if (matches) {
      matches.forEach(param => {
        const key = param.slice(2, -2)
        url = url.replace(param, params[key] || data[key])
      })
    }

    return new Promise((resolve, reject) => {
      Storage.get("user")
        .then(user => {
          if (user)
            req.headers["X-AUTH-TOKEN"] = user.id
          fetch(url, req)
            .then(response => response.json())
            .then(responseJSON => {
              if (responseJSON.message) {
                if (!responseJSON.statusCode)
                  responseJSON.statusCode = true
                reject(responseJSON)
              }
              else
                resolve(responseJSON)
            })
            .catch(reject)
            .then(() => loader ? Modal.fetching.hide() : null)
        })
    })
  }
}

export const mapUser = user => ({
  id: user.uiid,
  gender: user.gender,
  firstName: user.surname,
  lastName: user.name,
  birthDate: user.date_format,
  phoneNumber: user.phone,
  email: user.email
})

export const mapTrip = trip => ({
  id: trip.id,
  uuid: trip.trip_uuid,
  available: trip.travel_time.availableAdvert,
  company: trip.agency,
  category: trip.bus.category,
  amount: trip.price,
  fees: trip.travel_time.amount - trip.price,
  path: {
    begin: {
      city: {
        name: trip.departure_terminal.city.name,
        shortName: trip.departure_terminal.city.short_name || "Dep",
      },
      street: trip.departure_terminal.name
    },
    end: {
      city: {
        name: trip.arrival_terminal.city.name,
        shortName: trip.arrival_terminal.city.short_name || "Arr",
      },
      street: trip.arrival_terminal.name
    }
  },
  startDate: trip.travel_time.travelTrip + ' ' + trip.travel_time.departureHour,
  endDate: trip.travel_time.arrivalTrip + ' ' + trip.travel_time.arrivalHour,
  duration: trip.travel_time.duration,
  seats: trip.travel_time.availablePlaces,
})

export const mapBooking = booking => ({
  trip: mapTrip(booking.advert),
  amount: booking.amount,
  seats: booking.reserved_places,
  date: booking.extra_data.createBooking,
  ref: booking.reference || "---",
  status: booking.status
})
