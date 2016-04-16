import delay from './delay';
const debug = require('debug')('tutor:devDelay');

let devDelay;
if (process.env.NODE_ENV === 'production') {
  devDelay = () => Promise.resolve();
} else {
  devDelay = (duration = 1000) => {
    debug('%sms', duration);
    return delay(duration);
  };
}

export default devDelay;
