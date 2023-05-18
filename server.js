const jwt = require('jsonwebtoken')
const express = require('express')
require('dotenv').config()

const app = express()
app.use(express.json())

const posts = [
    {
        username: 'mehedi',
        title: 'this is test 1'
    },
    {
        username: 'hasan',
        title: 'this is test 2'
    },
    {
        username: 'hridoy',
        title: 'this is test 3'
    }
    
]

app.get('/posts',authenticateToken,(req,res) => {

    res.json(posts.filter(post =>post.username === req.user.name))
})

// app.post('/login',(req,res) => {
//     //auth
//     const username = req.body.username
//     const user = {name:username}
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     res.json({ accessToken: accessToken })
// })

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


app.listen(4081)