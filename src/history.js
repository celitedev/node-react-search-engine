import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useScrollToTop';

let history = null;

export const getHistory = () => history;

export default () => {
  history = useScroll(createHistory)();
  return history;
};
