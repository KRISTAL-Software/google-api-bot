class JsonError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
    }

    toJSON() {
        return {
            error: this.message,
            details: this.details
        };
    }
}