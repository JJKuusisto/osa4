const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUser = (user) => {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      adult: user.adult
    }
  }

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {_id:1,likes:1, author:1, title:1, url:1})
    response.json(users.map(User.format))
  })

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    const existingUser = await User.find({username: body.username})
    if (existingUser.length>0 || body.password.length < 4) {
      return response.status(400).json({ error: 'username must be unique and password atleast 3 characters' })
    }

    if(body.adult === undefined){
        body.adult = true
    }

    

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult
    })

    const savedUser = await user.save()

    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter