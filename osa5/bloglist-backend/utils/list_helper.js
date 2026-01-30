const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  else {
    return blogs.reduce( (maxBlog, blog) => (blog.likes > maxBlog.likes) ? blog : maxBlog )
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return {} }

  const uniqueAuthors = lodash.countBy(blogs, (blog) => blog.author )
  const maxAuthor = Object.entries(uniqueAuthors).reduce( (maxAuthor, author) => {
    return (author[1] > maxAuthor[1]) ? author : maxAuthor
  })

  return { 
    author: maxAuthor[0],
    blogs: maxAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return {} }

  const uniqueAuthors = lodash.groupBy(blogs, (blog) => blog.author)
  for (const author in uniqueAuthors) {
    const summedLikes = uniqueAuthors[author].reduce( (summedLikes, blog) => summedLikes + blog.likes, 0 )
    uniqueAuthors[author] = summedLikes
  }

  const mostLiked = { author: "", likes: -1 }
  for (const author in uniqueAuthors) {
    if (uniqueAuthors[author] > mostLiked.likes) {
      mostLiked.author = author
      mostLiked.likes = uniqueAuthors[author]
    }
  }

  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}