const { Router } = require('express')
const router = Router()
const User = require('../src/models/User')
const{ check, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

router.post('/registration',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').isLength({ min: 6 })
    ], 
    async (req, res) => {
    try {
        
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({message: 'Email or password must be correct'})
        }
        
        const { nickname, email, password } = req.body
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            nickname, email, password: hashedPassword
        })

        const isEmailMatch = await User.findOne({email})
        const isNicknameMatch = await User.findOne({nickname})

        if (isEmailMatch || isNicknameMatch){
            return res.status(300).json({message: 'User is exist'})
        }

        await user.save()

        res.status(201).json({message: 'Пользователь создан'})

    } catch (error) {
        console.log('error')
    }
})

router.post('/login', async (req, res) => {
    try {
        const { nickname, password } = req.body
        const user = await User.findOne({nickname})

        if (!user){
            return res.status(400).json({message: 'Пользователя нет в базе'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.status(400).json({message: 'Пароли не совпадают'})
        }

        const jwtSecret = 'ifuewh94uut38943gurgpidoriufh34i43853nj23n'

        const token = jwt.sign(
            {userId: user.id},
            jwtSecret,
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id})

    } catch (error) {
        console.log(error)
    }
})

module.exports = router