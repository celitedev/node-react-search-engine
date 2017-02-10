import config from '../config';
import fetch from '../fetch';

export default class SeatGeekApi {

  static affiliateCode() {
    return config.seatGeekAffiliateCode;
  }

  static addAffiliateCode(url) {
    return url.includes('?') ? `${url}&aid=${SeatGeekApi.affiliateCode()}` : `${url}?aid=${SeatGeekApi.affiliateCode()}`;
  }

  static async findByTitleAndDate(title, date) {
    const response = await fetch(SeatGeekApi.buildQuery(title, date), {method: 'GET'});
    if (response.status >= 200 && response.status < 300) {
      const result = await response.json();
      if (result.events.length > 0) {
        return SeatGeekApi.addAffiliateCode(result.events[0].url);
      }
    }
    return null;
  }

  static buildQuery(title, date) {
    const env = (process.env.NODE_ENV || 'production').toLowerCase();
    const apiRoot = 'https://api.seatgeek.com/2/';
    const clientId = config.seatGeekApiClientId[env];
    return `${apiRoot}/events?datetime_utc=${date}&q=${title}&client_id=${clientId}`;
  }
}
