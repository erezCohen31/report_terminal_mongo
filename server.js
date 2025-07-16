import express from 'express';
import reportsRouter from './routes/reportsRoute.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/reports', reportsRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the IntelReport API');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
