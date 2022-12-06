if (!Number.prototype.$floor) {
    Number.prototype.$floor = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.floor(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$ceil) {
    Number.prototype.$ceil = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.ceil(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$round) {
    Number.prototype.$round = function (decimals) {
        if (typeof decimals === 'undefined') {
            decimals = 0;
        }
        return Math.round(
            this * Math.pow(10, decimals)
        ) / Math.pow(10, decimals);
    };
}

if (!Number.prototype.$localize) {
    Number.prototype.$localize = function (decimals) {
        let options = {};
        if (typeof decimals !== 'undefined') {
            options.maximumFractionDigits = decimals;
        }
        return new Intl.NumberFormat(undefined, options).format(this);
    };
}

if (!Number.prototype.$currency) {
    Number.prototype.$currency = function (decimals) {
        let options = {};
        if (typeof decimals === 'undefined') {
            decimals = 2;
        }
        options.maximumFractionDigits = decimals;
        return new Intl.NumberFormat(undefined, options).format(this);
    };
}

if (!Number.prototype.$min) {
    Number.prototype.$min = function (limit) {
        if (limit < this) return limit;
        return this;
    };
}

if (!Number.prototype.$max) {
    Number.prototype.$max = function (limit) {
        if (limit > this) return limit;
        return this;
    };
}

if (!Number.prototype.$highest) {
    Number.prototype.$highest = function (limit) {
        return this.$min(limit);
    };
}

if (!Number.prototype.$lowest) {
    Number.prototype.$lowest = function (limit) {
        return this.$max(limit);
    };
}

if (!Number.prototype.$limit) {
    Number.prototype.$limit = function (minimum, maximum) {
        if (minimum !== null && this < minimum) return minimum;
        if (maximum !== null && this > maximum) return maximum;
        return this;
    };
}