const loginWith = async ( page, username, password ) => {// login to app
  await page.getByLabel("username").fill(username)
  await page.getByLabel("password").fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async ( page, title, author, url ) => {// create new blog
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel("title").fill(title)
  await page.getByLabel("author").fill(author)
  await page.getByLabel("url").fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async ( page, title, numberOfLikes ) => {// like a blog a given amount of times
  const blog = page.locator('.blog').filter({ hasText: title})
  await blog.getByRole('button', { name: 'view' }).click()

  for (let i = 0; i < numberOfLikes; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
    await blog.getByText(`likes ${i+1}`).waitFor()
  }
}

export { loginWith, createBlog, likeBlog }