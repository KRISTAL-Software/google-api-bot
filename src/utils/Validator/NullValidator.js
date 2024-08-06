module.exports = {
    nonNull: (any) => {
        return any && any !== undefined && any !== null;
    }
}