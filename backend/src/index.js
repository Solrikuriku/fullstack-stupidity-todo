const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3002

app.use(express.json({extended: true}))
app.use('/api/auth', require('../routes/auth.route'))
app.use('/api/todo', require('../routes/todo.route'))

async function start() {
    try {
            await mongoose.connect('mongodb+srv://admin:admin@uniproject.c5m73.mongodb.net/?retryWrites=true&w=majority&appName=uniproject')

            app.listen(PORT, () => {
                console.log(`Server started on port ${PORT}`)
            })
    } catch (err) {console.error(err)}
}

start()