import express from 'express';
import { IntelReport } from '../models/intelReport.js';
import { DBservice } from '../dal/reportsDal.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { fieldCode, location, threatLevel, description, confirmed } = req.body;

        if (!fieldCode || !location || !threatLevel || !description) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }


        const report = new IntelReport(
            fieldCode,
            location,
            parseInt(threatLevel, 10),
            description,
            Boolean(confirmed)
        );

        await DBservice.insertReport(report);

        res.status(201).json({
            message: '✅ Report created successfully',
            report
        });
    } catch (error) {
        res.status(400).json({
            message: '❌ Invalid report data',
            error: error.message
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const reports = await DBservice.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch reports', error: error.message });
    }
});

router.get('/high', async (req, res) => {
    try {
        const reports = await DBservice.getHighReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch high threat reports', error: error.message });
    }
});

router.put('/:id/confirm', async (req, res) => {
    try {
        const { id } = req.params;
        await DBservice.confirmReportById(id);
        res.status(200).json({ message: `✅ Report ${id} confirmed` });
    } catch (error) {
        res.status(400).json({ message: '❌ Failed to confirm report', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await DBservice.deleteReportById(id);
        res.status(200).json({ message: `🗑️ Report ${id} deleted` });
    } catch (error) {
        res.status(400).json({ message: '❌ Failed to delete report', error: error.message });
    }
});
router.get('/agent/:fieldCode', async (req, res) => {
    try {
        const { fieldCode } = req.params;
        const report = await DBservice.getReportByAgent(fieldCode);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch reports', error: error.message });
    }
})

router.get('/stats', async (req, res) => {
    try {
        const stats = await DBservice.getReportStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch stats', error: error.message });
    }
})
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const report = await DBservice.getReportById(id);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch reports', error: error.message });
    }
})



export default router;
