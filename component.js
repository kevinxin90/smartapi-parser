const _ = require("lodash");

module.exports = class Components {
    constructor(components) {
        this.components = components
    }

    /**
     * Fetch corresponding component based on $ref provided
     * param {string} ref - the $ref path
     */
    fetchComponentByRef = (ref) => {
        if (ref.startsWith("#/components/")) {
            if (ref.substr(-1) === '/') {
                ref = ref.substr(0, ref.length - 1);
            };
            let res = _.cloneDeep(this.components);
            const path = ref.split('/');
            try {
                for (let ele of path) {
                    if (!['#', 'components'].includes(ele)) {
                        res = res[ele];
                    }
                }
            } catch (err) {
                return undefined
            }
            return res;
        }
        return undefined;
    }
}
