import _ from 'lodash';
import { SmartAPIComponentObject } from './common/types';

export = class Components {
  components: SmartAPIComponentObject;

  constructor(components: SmartAPIComponentObject) {
    this.components = components;
  }

  /**
   * Fetch corresponding component based on $ref provided
   * param {string} ref - the $ref path
   */
  fetchComponentByRef(ref: string) {
    if (ref.startsWith('#/components/')) {
      if (ref.substr(-1) === '/') {
        ref = ref.substr(0, ref.length - 1);
      }
      let res = _.cloneDeep(this.components);
      const path = ref.split('/');
      try {
        for (const ele of path) {
          if (!['#', 'components'].includes(ele)) {
            res = res[ele];
          }
        }
      } catch (err) {
        return undefined;
      }
      return res;
    }
    return undefined;
  }
};
