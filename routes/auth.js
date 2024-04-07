const express = require('express')
const router = express.Router()
const {
    protected
} = require('../controllers/auth')

router.get('/protected', protected)

module.exports = router