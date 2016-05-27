import rethinkdbdash from 'rethinkdbdash';
import config from '../config-private';

const r = rethinkdbdash(config.db);

export default r;
