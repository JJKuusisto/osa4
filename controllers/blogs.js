const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog
      .find({})
      .populate('user', {username:1, name:1})
    response.json(blogs.map(Blog.format))
  })
  
  blogsRouter.post('/', async(request, response) => {
    const body = request.body
    try{
      const decodedToken = jwt.verify(request.token, process.env.SECRET)

      if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      if(body.likes === undefined){
        body.likes = 0
      }

      const user = await User.findById(decodedToken.id)

      if(body.title === undefined || body.url === undefined){
        return response.status(400).json({error: 'title or url missing'})
      }
    
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user
      })

      const savedBlog = await blog.save()

      user.blogs = user.blogs.concat(savedBlog)
      await user.save()

      response.json(Blog.format(savedBlog))
    } catch(exception){
        if (exception.name === 'JsonWebTokenError' ) {
          response.status(401).json({ error: exception.message })
        } else {
          console.log(exception)
          response.status(500).json({ error: 'something went wrong...' })
        }
    }
  })
  

blogsRouter.delete('/:id', async(request,response) =>{
  const blog = await Blog.findById(request.params.id)
  console.log(request.token)
 
  try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const user = await User.findById(decodedToken.id)
      
      if(blog.user.toString() === user.id.toString()){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
      } else {
        response.status(400).send({error: 'only person who created blog can remove it'})
      }
  } catch(exception){
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(400).json({ error: 'something went wrong...' })
    }
}
})

blogsRouter.put('/:id', async(request, response) => {
  try {
    const body = request.body
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
    response.json(Blog.format(savedBlog))
  } catch(exception) {
    console.log(exception)
    response.status(400).send({error: 'malformatted id'})
    }
})

  module.exports = blogsRouter