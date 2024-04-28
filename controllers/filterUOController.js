const User = require('../models/User');
const Offer = require('../models/Offer');

const filterUOCtrl = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const offerCount = await Offer.countDocuments();

        const data = {
            labels: ['Users', 'Offers'],
            datasets: [
                {
                    label: 'Count',
                    data: [userCount, offerCount],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                }
            ]
        };

        res.json({ data });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = filterUOCtrl;