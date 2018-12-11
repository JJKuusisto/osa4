const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')



beforeAll(async() => {
    await Blog.remove({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('adding new blog', async () => {
    const newBlog = {
      author: "Jarmo Kuusisto",
      title: "Testiblogi",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 0
    }

    const blogsBefore = await helper.blogsInDb()

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAfter = await helper.blogsInDb()
    

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter).toContainEqual(newBlog)
})

test('if likes is null set 0', async () => {
    const newBlog = {
      title: "Testiblogi2",
      author: "Jarmo Kuusisto",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }

    const blogsBefore = await helper.blogsInDb()

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAfter = await helper.blogsInDb()
     
    expect(blogsAfter.length).toBe(blogsBefore.length+1)
    expect(blogsAfter[blogsAfter.length - 1].likes).toBe(0)
    
})

test('title and url missing', async () => {
    const newBlog = {
      author: "Jarmo Kuusisto",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    
})



afterAll(() => {
  server.close()
})