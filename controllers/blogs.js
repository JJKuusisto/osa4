const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
  blogsRouter.post('/', async(request, response) => {
    const body = request.body

    if(body.likes === undefined){
      body.likes = 0
    }

    if(body.title === undefined || body.url === undefined){
      return response.status(400).json({error: 'title or url missing'})
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })

    const savedBlog = await blog.save()
    response.json(savedBlog)
  })

  module.exports = blogsRouter