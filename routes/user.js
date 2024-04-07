const express = require('express')
const router = express.Router()

const {
    users,
    register,
    login
} = require('../controllers/user')


router.get('/users', users)
router.post('/register', register)
router.post('/login', login)

module.exports = router