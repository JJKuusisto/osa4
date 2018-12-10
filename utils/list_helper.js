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
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }