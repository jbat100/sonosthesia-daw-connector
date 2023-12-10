
class AggregateException extends Error {
    constructor(errors) {
        super(`Aggregate: ${errors.map(e => e.message).join(', ')}`);
        this.errors = errors;
    }
}

module.exports = {
    AggregateException
}