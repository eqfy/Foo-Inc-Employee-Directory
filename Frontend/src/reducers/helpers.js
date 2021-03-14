export const mergeIds = (orig, other) => {
    for (const [key, value] of Object.entries(other)) {
        if (!orig[key]) {
            orig[key] = value;
        } else {
            orig[key] = orig[key].concat(value);
        }
    }
    return orig;
};
