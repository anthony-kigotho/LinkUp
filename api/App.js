const express = require('express')
const { userRouter } = require('./Routes/routes')
const cors = require('cors')

const app = express()


app.use(express.json())
app.use(cors())
app.use('/user', userRouter)

app.use((err, req, res, next) => {
    res.json({Error: err})
})

app.listen(4500, ()=>{
    console.log('Server running on port 4500');
})