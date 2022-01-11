const { validationResult, matchedData } = require("express-validator");
const mongoose  = require("mongoose");
const bcrypt = require('bcrypt');

const State = require("../models/State");
const User = require('../models/User');

module.exports = {
    signin: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.json({error: errors.mapped()});
            return;
        }
        const data = matchedData(req);

        const user = await User.findOne({email: data.email});

        // validando o e-mail
        if(!user) {
            res.json({error: 'E-mail e/ou senha errados'});
            return;
        }

        // validando a senha
        const match = await bcrypt.compare(data.password, user.passwordHash);
        if(!match) {
            res.json({error: 'E-mail e/ou senha errados'});
            return;
        }

        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        user.token = token;
        await user.save();

        res.sjon({token, email: data.email});
    },
    signup: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.json({error: errors.mapped()});
            return;
        }
        const data = matchedData(req);

        //verificando se e-mail existe já no sistema
        const user = await User.findOne({
            email: data.email
        });
        if(user) {
            res.json({
                error: {email: {msg: 'E-mail já existe'}}
            });
            return;
        }

        //verificando se estado existe
        if(mongoose.Types.ObjectId.isValid(data.state)) {
            const stateItem = await State.findOne({state: data.state});
            if(!stateItem) {
                res.json({
                    error: {state:{msg: 'Estado não existe'}}
                });
                return;
            }
        } else {
            res.json({
                error: {state: {msg: 'Código de estado inválido'}}
            });
            return;
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        const newUser = new User({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            state: data.state
        });
        await newUser.save();
        
        res.json({token});
    }
}