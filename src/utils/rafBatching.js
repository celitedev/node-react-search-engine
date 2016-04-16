import raf from 'raf';

export default function rafBatching(callback) {
  let schedule = null;
  let items = [];
  return item => {
    items.push(item);
    if (!schedule) {
      schedule = raf(() => {
        callback(items);
        items = [];
        schedule = null;
      });
    }
  };
}
