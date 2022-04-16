const deepDiffMapper = function () {
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map: function (obj1, obj2) {
            let key;
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                if (this.compareValues(obj1, obj2) === this.VALUE_UPDATED) {
                    return {
                        type: this.compareValues(obj1, obj2),
                        newValue: obj2,
                        oldValue: obj1
                    };
                } else {
                    return undefined
                }

            }

            const diff = {};
            for (key in obj1) {
                if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
                    continue;
                }

                if (this.isFunction(obj1[key])) {
                    continue;
                }

                let value2 = undefined;
                if (obj2[key] !== undefined) {
                    value2 = obj2[key];
                }

                const value = this.map(obj1[key], value2)
                if (value !== undefined) {
                    diff[key] = value;
                }
            }
            for (key in obj2) {
                if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
                    continue;
                }

                if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                    continue;
                }

                const value = this.map(undefined, obj2[key]);
                if (value !== undefined) {
                    diff[key] = value;
                }
            }

            return diff
        },
        compareValues: function (value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if (value1 === undefined) {
                return this.VALUE_CREATED;
            }
            if (value2 === undefined) {
                return this.VALUE_DELETED;
            }
            return this.VALUE_UPDATED;
        },
        isFunction: function (x) {
            return Object.prototype.toString.call(x) === '[object Function]';
        },
        isArray: function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        },
        isDate: function (x) {
            return Object.prototype.toString.call(x) === '[object Date]';
        },
        isObject: function (x) {
            return Object.prototype.toString.call(x) === '[object Object]';
        },
        isValue: function (x) {
            return !this.isObject(x) && !this.isArray(x);
        }
    }
}();

module.exports = deepDiffMapper