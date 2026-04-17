const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  // Return the blog with the most likes
  return blogs.reduce((fav, blog) => {
    if (!fav || blog.likes > fav.likes) {
      return blog
    }
    return fav
  }, null)
}
const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const count = {}

  blogs.forEach(blog => {
    // If the author is already in the count object, add 1; otherwise start at 1
    count[blog.author] = (count[blog.author] || 0) + 1
  })

  // Find the author with the most blogs
  let maxBlogs = 0
  let topAuthor = null

  for (const author in count) {
    if (count[author] > maxBlogs) {
      maxBlogs = count[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesByAuthor = {}

  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i]

    if (!likesByAuthor[blog.author]) {
      likesByAuthor[blog.author] = 0
    }

    likesByAuthor[blog.author] += blog.likes
  }

  let topAuthor = null
  let maxLikes = 0

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikes) {
      maxLikes = likesByAuthor[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
    mostLikes
}