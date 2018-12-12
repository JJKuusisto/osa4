const supertest = require('supertest')
const { app, server } = require('../index')
const Blog = require('../models/blog')
const User = require('../models/user')
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

describe('user creation related tests', async () => {

    beforeAll(async () => {
        await User.remove({username: 'jarmokuu'})
        await User.remove({username: 'annivir'})
      })
  
    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await helper.usersInDb()
  
      const newUser = {
        username: 'jarmokuu',
        name: 'Jarmo Kuusisto',
        password: 'salasana',
        adult:true
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAfterOperation = await helper.usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const usernames = usersAfterOperation.map(u=>u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('POST api/users fails when user already exists', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const newUser = {
            username: 'jarmokuu',
            name: 'Jarmo Kuusisto',
            password: 'salasana',
            adult: true
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique and password atleast 3 characters'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

    })

    test('POST api/users fails if password is under 3 characters', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const newUser = {
            username: 'pekkakoi',
            name: 'Pekka Koivunen',
            password: 'pw',
            adult: true
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual({ error: 'username must be unique and password atleast 3 characters'})

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)

    })

    test('POST api/users without adult defined', async () => {
        const usersBeforeOperation = await helper.usersInDb()

        const newUser = {
            username: 'annivir',
            name: 'Anni Virtanen',
            password: 'classified'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(result.body.adult).toEqual(true)

        const usersAfterOperation = await helper.usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length + 1)

    })
  })



afterAll(() => {
  server.close()
})