export class IntelReport {
    constructor(fieldCode, location, threatLevel, description, confirmed) {
        if (typeof fieldCode !== 'string' || fieldCode.trim() === '') {
            throw new Error("fieldCode must be a non-empty string.");
        }

        if (typeof location !== 'string' || location.trim() === '') {
            throw new Error("location must be a non-empty string.");
        }

        const allowedThreatLevels = [1, 2, 3, 4, 5];
        if (!allowedThreatLevels.includes(threatLevel)) {
            throw new Error(`threatLevel must be one of: ${allowedThreatLevels.join(', ')}.`);
        }

        if (typeof description !== 'string' || description.trim() === '') {
            throw new Error("description must be a non-empty string.");
        }

        if (typeof confirmed !== 'boolean') {
            throw new Error("confirmed must be a boolean.");
        }

        this.fieldCode = fieldCode;
        this.location = location;
        this.threatLevel = threatLevel;
        this.description = description;
        this.date = new Date();
        this.confirmed = confirmed;
    }
}
