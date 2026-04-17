const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset database and create a test user
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
      }
    })
    // Visit the app
    await page.goto('http://localhost:5173/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
       await page.getByText('login').click()

      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByText('login').click()

      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
  beforeEach(async ({ page }) => {
      await page.getByText('login').click()

      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('password123')
      await Promise.all([
        page.getByRole('button', { name: 'login' }).click(),
        page.getByText('logout').waitFor()
  ])
  })

  test('a new blog can be created', async ({ page }) => {
  await page.getByRole('link', { name: 'new blog' }).click()

  await page.waitForURL('**/create') 

  await page.getByLabel('title').fill('Test Blog')
  await page.getByLabel('author').fill('Test Author')
  await page.getByLabel('url').fill('http://testblog.com')

  await page.getByRole('button', { name: 'create' }).click()

  await expect(page.getByText('Test Blog Test Author')).toBeVisible()
})

test('a blog can be liked', async ({ page }) => {
  await page.getByText('new blog').click()

  await page.getByLabel('title').fill('Like Test')
  await page.getByLabel('author').fill('Tester')
  await page.getByLabel('url').fill('http://test.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.getByText('Like Test Tester')
  await expect(blog).toBeVisible()

  await blog.click() // since you now route to blog page

  await page.getByRole('button', { name: 'like' }).click()

  await expect(page.getByText('likes 1')).toBeVisible()
})

test('a user can delete blog', async ({ page }) => {
  await page.getByText('new blog').click()

  await page.getByLabel('title').fill('Delete Test Blog')
  await page.getByLabel('author').fill('Tester')
  await page.getByLabel('url').fill('http://delete-test.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.getByText('Delete Test Blog Tester')
  await expect(blog).toBeVisible()

  await blog.click()

  page.on('dialog', dialog => dialog.accept())

  await page.getByRole('button', { name: 'remove' }).click()

  await expect(blog).not.toBeVisible()
})



})

test('only the creator can see the delete button', async ({ page, request }) => {
  // Reset database
  await request.post('http://localhost:3003/api/testing/reset');

  // Create two users
  const user1 = {
    username: 'user1',
    name: 'User One',
    password: 'password'
  };

  const user2 = {
    username: 'user2',
    name: 'User Two',
    password: 'password'
  };

  await request.post('http://localhost:3003/api/users', { data: user1 });
  await request.post('http://localhost:3003/api/users', { data: user2 });

  // === Login as user1 and create blog ===
  await page.goto('http://localhost:5173/');

  await page.getByText('login').click()

  await page.getByLabel('username').fill(user1.username);
  await page.getByLabel('password').fill(user1.password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

  await page.getByRole('link', { name: /new blog/i }).click();
  await page.waitForURL('**/create');

  await page.getByLabel('title').fill('Ownership Test Blog');
  await page.getByLabel('author').fill('Tester');
  await page.getByLabel('url').fill('http://test.com');
  await page.getByRole('button', { name: /create/i }).click();

  // Open the created blog (list view → detail or expanded view)
  const blogTitle = page.getByText('Ownership Test Blog Tester');
  await expect(blogTitle).toBeVisible();
  await blogTitle.click();

  // Creator (user1) MUST see the remove button
  await expect(page.getByRole('button', { name: /remove/i })).toBeVisible();

  // Logout
  await page.getByText('logout').click()

  // === Login as user2 ===
  await page.getByText('login').click()

  await page.getByLabel('username').fill(user2.username);
  await page.getByLabel('password').fill(user2.password);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

  // Find and open the same blog
  const blogAsOther = page.getByText('Ownership Test Blog Tester');
  await expect(blogAsOther).toBeVisible();
  await blogAsOther.click();

  // Non-creator (user2) should NOT see the remove button
  await expect(page.getByRole('button', { name: /remove/i })).toHaveCount(0);
});

test('blogs are ordered according to likes (most liked first)', async ({ page }) => {
  // Login with the default test user (created in beforeEach of the parent describe)
  await page.getByText('login').click()

  await page.getByLabel('username').fill('testuser');
  await page.getByLabel('password').fill('password123');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

  const createBlog = async (title, author, url) => {
    await page.getByRole('link', { name: /new blog/i }).click();
    await page.waitForURL('**/create');

    await page.getByLabel('title').fill(title);
    await page.getByLabel('author').fill(author);
    await page.getByLabel('url').fill(url);

    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText(`${title} ${author}`)).toBeVisible();
  };

  await createBlog('Least liked blog', 'Author1', 'http://a.com');
  await createBlog('Medium liked blog', 'Author2', 'http://b.com');
  await createBlog('Most liked blog', 'Author3', 'http://c.com');

  const likeBlog = async (title, times) => {
    // Find the blog in the list
    const blog = page.locator('.blog').filter({ hasText: title });

    // Expand the blog details if necessary
    await blog.getByRole('button', { name: /view|hide/i }).click();

    for (let i = 0; i < times; i++) {
      await blog.getByRole('button', { name: /like/i }).click();
      // Wait for the like count to update in DOM
      await expect(blog).toContainText(`likes ${i + 1}`, { timeout: 5000 });
    }
  };

  await likeBlog('Least liked blog', 1);
  await likeBlog('Medium liked blog', 3);
  await likeBlog('Most liked blog', 5);

  // Reload to ensure the frontend re-sorts the blogs
  await page.reload();

  const blogs = page.locator('.blog');

  // Most liked should be first
  await expect(blogs.nth(0)).toContainText('Most liked blog');
  await expect(blogs.nth(1)).toContainText('Medium liked blog');
  await expect(blogs.nth(2)).toContainText('Least liked blog');
});
})