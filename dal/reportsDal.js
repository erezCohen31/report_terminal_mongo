import { ObjectId } from 'mongodb';
import { connectDB, client } from '../lib/connectDB.js';

const db = client.db('intelDB');
const reports = db.collection('intel_report');

export const DBservice = {
    async insertReport(report) {
        try {
            await connectDB(async () => {
                const result = await reports.insertOne(report);
                console.log('📄 Inserted report with ID:', result.insertedId);
            });
        } catch (error) {
            console.error('❌ insertReport error:', error.message);
        }
    },

    async getAllReports() {
        try {
            let allReports;
            await connectDB(async () => {
                allReports = await reports.find().toArray();
            });
            return allReports;
        } catch (error) {
            console.error('❌ getAllReports error:', error.message);
            return [];
        }
    },

    async getHighReports() {
        try {
            let highReports;
            await connectDB(async () => {
                highReports = await reports.find({ threatLevel: { $gte: 4 } }).toArray();
            });
            return highReports;
        } catch (error) {
            console.error('❌ getHighReports error:', error.message);
            return [];
        }
    },


    async confirmReportById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                console.log(`❌ Invalid ID format: ${id}`);
                return;
            }

            const objectId = new ObjectId(id);

            await connectDB(async () => {
                const result = await reports.updateOne(
                    { _id: objectId },
                    { $set: { confirmed: true } }
                );

                if (result.matchedCount === 0) {
                    console.log(`❌ No report found with ID: ${id}`);
                } else {
                    console.log(`✅ Report ${id} marked as confirmed`);
                }
            });
        } catch (error) {
            console.error('❌ confirmReportById error:', error.message);
        }
    },

    async deleteReportById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                console.log(`❌ Invalid ID format: ${id}`);
                return;
            }

            const objectId = new ObjectId(id);

            await connectDB(async () => {
                const result = await reports.deleteOne({ _id: objectId });

                if (result.deletedCount === 0) {
                    console.log(`❌ No report found with ID: ${id}`);
                } else {
                    console.log(`🗑️ Report ${id} deleted successfully`);
                }
            });
        } catch (error) {
            console.error('❌ deleteReportById error:', error.message);
        }
    },

    async getReportById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                console.log(`❌ Invalid ID format: ${id}`);
                return;
            }
            const objectId = new ObjectId(id);
            let report;
            await connectDB(async () => {
                report = await reports.findOne({ _id: objectId });
            });
            if (report) {
                return report;
            } else {
                console.log(`❌ No report found with ID: ${id}`);
                return null;
            }
        } catch (error) {
            console.error('❌ getReportById error:', error.message);
            return null;
        }
    },
    async getReportByAgent(idAgent) {
        try {

            let reportsByAgent;
            await connectDB(async () => {
                reportsByAgent = await reports.findOne({ fieldCode: idAgent });
            });
            if (reportsByAgent) {
                return reportsByAgent;
            } else {
                console.log(`❌ No report found for fieldCode: ${idAgent}`);
                return null;
            }
        } catch (error) {
            console.error('❌ getReportByAgent error:', error.message);
            return null;
        }
    },
    async getReportStats() {
        try {
            let stats = {};

            await connectDB(async () => {
                const total = await reports.countDocuments();
                const highThreat = await reports.countDocuments({ threatLevel: { $gte: 4 } });
                const confirmed = await reports.countDocuments({ confirmed: true });

                stats = {
                    totalReports: total,
                    highThreatReports: highThreat,
                    confirmedReports: confirmed
                };
            });

            return stats;
        } catch (error) {
            console.error('❌ getReportStats error:', error.message);
            return null;
        }
    }

};
