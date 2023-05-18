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

let refreshTokens = []

app.post('/logout',(req,res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
})

// app.get('/posts',authenticateToken,(req,res) => {

//     res.json(posts.filter(post =>post.username === req.user.name))
// })

app.post('/login',(req,res) => {
    //auth
    const username = req.body.username
    const user = {name:username}
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'})
}

app.post('/token',(req,res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if (refreshTokens.includes(refreshToken))  return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken:accessToken})
    })
})


app.listen(4080)