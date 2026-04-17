const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { test, describe } = require('node:test')

describe('most blogs', () => {
  const blogs = [
    { title: "A", author: "Alice", likes: 5 },
    { title: "B", author: "Bob", likes: 3 },
    { title: "C", author: "Alice", likes: 7 },
    { title: "D", author: "Bob", likes: 2 },
    { title: "E", author: "Alice", likes: 1 }
  ]

  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: "Alice", blogs: 3 })
  })
})

