import Firebase from 'firebase';
import config from '../config';

export function ref(path) {
  return new Firebase(`${config.firebase.baseUrl}${path}`);
}

export const TIMESTAMP = Firebase.ServerValue.TIMESTAMP;
