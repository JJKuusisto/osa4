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

blogsRouter.delete('/:id', async(request,response) =>{
  try {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch(exception) {
      console.log(exception)
      response.status(400).send({error: 'malformatted id'})
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
    response.json(savedBlog)
  } catch(exception) {
    console.log(exception)
    response.status(400).send({error: 'malformatted id'})
    }
})

  module.exports = blogsRouter