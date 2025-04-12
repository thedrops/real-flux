const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../models');
const Transaction = db.transaction;

// Create a new transaction
router.post('/', verifyToken, async (req, res) => {
    try {
        const { description, amount, currency, exchange_rate, transaction_type, transaction_date } = req.body;
        const transactionData = {
            user_id: req.userId,
            description,
            amount,
            currency,
            exchange_rate,
            transaction_type,
            transaction_date
        }
        const transaction = await Transaction.create(transactionData);
        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all transactions
router.get('/', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                user_id: req.userId
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get transaction by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id, {
            where: {
                user_id: req.userId
            }
        });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update transaction
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { description, amount, currency, exchange_rate, transaction_type, transaction_date } = req.body;
        const transaction = await Transaction.findByPk(req.params.id, {
            where: {
                user_id: req.userId
            }
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.update({
            description,
            amount,
            currency,
            exchange_rate,
            transaction_type,
            transaction_date
        });
        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete transaction
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id, {
            where: {
                user_id: req.userId
            }
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;