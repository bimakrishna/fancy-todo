const { User } = require('../models')
const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')


class UserController {
    static async register(req, res) {
        try {
            const payload = {
                email: req.body.email,
                password: req.body.password
            }
            const newuser = await User.create(payload)

            res.status(201).json({
                id: newuser.id,
                email: newuser.email
            })
        }catch (error){
            console.log(error)
            res.status(500).json(error)
        }
    }

    static async login (req, res) {
        try {
            const payload = {
                email: req.body.email,
                password: req.body.password
            }
            const user = await User.findOne({
                where: {
                    email: payload.email
                }
            })
            if(!user) {
                res.status(401).json({
                    msg: 'wrong password/email'
                })
            } else if (!comparePassword(payload.password, user.password)) {
                res.status(401).json({
                    message: "wrong password/email"
                })
            }else {
                console.log('sampe')
                const access_token = signToken({
                    id: user.id,
                    email: user.email
                })
                res.status(200).json({
                    access_token
                })
            }
        }catch(error){
            res.status(500).json(error)
        }
    }
}

module.exports = UserController