import axios from '../services/axios'
// import axios from 'axios';
export default async function updateBalance(amount) {
    if (!amount) {
        return 0;
    }
    try {
        const res = await axios.post('/balance/update', {
            amount: amount,
        });

        return res.data.user;
    } catch (err) {
        console.log(err);
    }
}