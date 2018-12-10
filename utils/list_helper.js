const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
      }

      return blogs.map(x => x.likes).reduce(reducer,0)
    
}

const favoriteBlog = (blogs) => {
    let suosituin = 0
    let id = 0
    blogs.forEach(element => {
        if(element.likes > suosituin){
            suosituin = element.likes
            id = element._id
        }
    })
    console.log(id)
    return blogs.filter(b => b._id === id)
}

const mostBlogs = (blogs) => {
    let authors = []
    blogs.forEach(b => {
        if(authors.some(function(x) { return x.author === b.author})){
            let foundIndex = authors.findIndex(i => i.author === b.author)
            authors[foundIndex].blogs += 1
        } else {
            let newAuthor = {}
            newAuthor.author = b.author
            newAuthor.blogs = 1
            authors.push(newAuthor)
        }
    })

    let eniten = 0
    let author = ''

    authors.forEach(element => {
        if(element.blogs > eniten){
            eniten = element.blogs
            author = element.author
        }
    })

    return authors.filter(a => a.author === author)
}

const mostLikes = (blogs) => {
    let authors = []
    blogs.forEach(b => {
        if(authors.some(function(x) { return x.author === b.author})){
            let foundIndex = authors.findIndex(i => i.author === b.author)
            authors[foundIndex].likes += b.likes
        } else {
            let newAuthor = {}
            newAuthor.author = b.author
            newAuthor.likes = b.likes
            authors.push(newAuthor)
        }
    })

    let eniten = 0
    let author = ''

    authors.forEach(element => {
        if(element.likes > eniten){
            eniten = element.likes
            author = element.author
        }
    })

    return authors.filter(a => a.author === author)
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }