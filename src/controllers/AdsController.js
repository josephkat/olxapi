const Category = require("../models/Category")
const User = require("../models/User")

module.exports = {
    getCategories: async (req, res) => {
        const cats = await Category.find();

        let categories = [];

        for (let i in cats) {
            categories.push({
                ...cats[i]._doc,
                img:`${process.env.BASE}/assets/images/${cats[i].slug}.png`
            });
        }

        res.json({categories});
    },
    addAction: async (req, res) => {
        let { title, price, priceneg, desc, cat, token } = req.body;
        const user = await User.findOne({token}).exec();

        if(!title || !cat) {
            res.json({error: 'Titulo e/ou categoria não foram preenchidos'});
            return;
        }

        if(price) {
            
        }
    },
    getList: async (req, res) => {},
    getItem: async (req, res) => {},
    editAction: async (req, res) => {}
}