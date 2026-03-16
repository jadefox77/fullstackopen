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