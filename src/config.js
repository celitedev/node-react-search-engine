import _ from 'lodash';

import config from '../config-public.yml';
import localConfig from '../local-config-public.yml';

export default _.merge(config, localConfig);
