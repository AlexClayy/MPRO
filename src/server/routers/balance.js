import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../schemas/User.js';

var router = express.Router();

// Get user's current balance.
router.get('/current');

// Update user's balance.
router.post('/update',
    [
        body('amount').isNumeric().toInt(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(errors);
        }

        const { id } = jwt.decode(req.header("auth_token"));
        const amount = req.body.amount;

        try {
            const user = await User.findById(id);

            user.balance += amount;

            await user.save();

            res.status(200).json({
                user: {
                    username: user.username,
                    balance: user.balance,
                }
            });
        } catch (err) {
            res.status(400).send(err);
        }
    });

export default router