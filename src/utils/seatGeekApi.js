import config from '../config';
import fetch from '../fetch';

export default class SeatGeekApi {

  static affiliateCode() {
    return config.seatGeekAffiliateCode;
  }

  static addAffiliateCode(url) {
    return url.includes('?') ? `${url}&aid=${SeatGeekApi.affiliateCode()}` : `${url}?aid=${SeatGeekApi.affiliateCode()}`;
  }

  static async findEvent(title, date) {
    const response = await fetch(SeatGeekApi.buildQuery('event', title, date), {method: 'GET'});
    if (response.status >= 200 && response.status < 300) {
      const result = await response.json();
      if (result.events.length > 0) {
        return SeatGeekApi.addAffiliateCode(result.events[0].url);
      }
    }
    return null;
  }

  static async findVenue(title) {
    const response = await fetch(SeatGeekApi.buildQuery('venue', title), {method: 'GET'});
    if (response.status >= 200 && response.status < 300) {
      const result = await response.json();
      if (result.venues.length > 0) {
        return SeatGeekApi.addAffiliateCode(result.venues[0].url);
      }
    }
    return null;
  }

  static async findPerformer(title) {
    const response = await fetch(SeatGeekApi.buildQuery('performer', title), {method: 'GET'});
    if (response.status >= 200 && response.status < 300) {
      const result = await response.json();
      if (result.performers.length > 0) {
        return SeatGeekApi.addAffiliateCode(result.performers[0].url);
      }
    }
    return null;
  }

  static buildQuery(type, title, date = null) {
    const env = (process.env.NODE_ENV || 'production').toLowerCase();
    const apiRoot = 'https://api.seatgeek.com/2/';
    const clientId = config.seatGeekApiClientId[env];
    if (type === 'event') {
      return `${apiRoot}events?datetime_utc=${date}&q=${encodeURIComponent(title)}&client_id=${clientId}`;
    } else if (type === 'venue') {
      return `${apiRoot}venues?city=New York&q=${encodeURIComponent(title)}&client_id=${clientId}`;
    } else if (type === 'performer') {
      return `${apiRoot}performers?q=${encodeURIComponent(title)}&client_id=${clientId}`;
    }
  }
}
