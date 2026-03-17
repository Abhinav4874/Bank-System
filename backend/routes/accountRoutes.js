const express = require('express');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Create Account
router.post('/create', auth, async (req, res) => {
    try {
        const account = new Account({
            user: req.user.id,
            accountNumber: Date.now().toString(),
            balance: 0
        });

        await account.save();
        res.status(201).json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Deposit
router.post('/deposit/:id', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const account = await Account.findById(req.params.id);
        account.balance += amount;
        await account.save();

        await new Transaction({
            account: account.id,
            type: 'deposit',
            amount
        }).save();

        res.json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Withdraw
router.post('/withdraw/:id', auth, async (req, res) => {
    const { amount } = req.body;

    try {
        const account = await Account.findById(req.params.id);

        if (account.balance < amount)
            return res.status(400).json({ message: "Insufficient balance" });

        account.balance -= amount;
        await account.save();

        await new Transaction({
            account: account.id,
            type: 'withdraw',
            amount
        }).save();

        res.json(account);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Transactions
router.get('/transactions/:id', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ account: req.params.id });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;