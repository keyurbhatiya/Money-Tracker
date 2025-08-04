const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'transactions.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize JSON file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(dataFile);
        console.log('transactions.json exists');
    } catch {
        console.log('Creating transactions.json');
        await fs.writeFile(dataFile, JSON.stringify([]));
    }
}

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        let transactions = [];
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            if (data.trim()) {
                transactions = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error reading transactions:', error.message);
        }
        res.json(transactions);
    } catch (error) {
        console.error('Error in GET /api/transactions:', error.message);
        res.status(500).json({ error: 'Error reading transactions' });
    }
});

// Add new transaction
app.post('/api/transactions', async (req, res) => {
    try {
        let transactions = [];
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            if (data.trim()) {
                transactions = JSON.parse(data);
                await fs.writeFile(dataFile + '.backup', data); // Create backup
            }
        } catch (error) {
            console.error('Error reading file:', error.message);
        }
        transactions.unshift(req.body);
        await fs.writeFile(dataFile, JSON.stringify(transactions, null, 2));
        res.json(transactions);
    } catch (error) {
        console.error('Error adding transaction:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });
        res.status(500).json({ error: 'Error adding transaction' });
    }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
    try {
        let transactions = [];
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            if (data.trim()) {
                transactions = JSON.parse(data);
                await fs.writeFile(dataFile + '.backup', data); // Create backup
            }
        } catch (error) {
            console.error('Error reading file:', error.message);
        }
        transactions = transactions.filter(t => t.id !== req.params.id);
        await fs.writeFile(dataFile, JSON.stringify(transactions, null, 2));
        res.json(transactions);
    } catch (error) {
        console.error('Error deleting transaction:', error.message);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

// Export transactions
app.get('/api/transactions/export', async (req, res) => {
    try {
        let transactions = [];
        try {
            const data = await fs.readFile(dataFile, 'utf8');
            if (data.trim()) {
                transactions = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error reading file for export:', error.message);
        }
        res.json(transactions);
    } catch (error) {
        console.error('Error exporting transactions:', error.message);
        res.status(500).json({ error: 'Error exporting transactions' });
    }
});

app.listen(port, async () => {
    await initializeDataFile();
    console.log(`Server running at http://localhost:${port}`);
});