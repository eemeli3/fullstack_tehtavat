const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {// reset databases and create user
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrongPassword')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page, request }) => {// login to app
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('Javascript is great Matti Meikäläinen', { exact: true })).not.toBeVisible()// check blog is not in app

      await createBlog(page, 'Javascript is great', 'Matti Meikäläinen', 'http://forum.com/blogs/1sd1231s12')
      
      await expect(page.getByText('Javascript is great Matti Meikäläinen')).toBeVisible()// check blog has been added
    })
    describe('When blog exists', () => {
      beforeEach(async ({ page, request }) => {// create blog
        await createBlog(page, 'Javascript is great', 'Matti Meikäläinen', 'http://forum.com/blogs/1sd1231s12')
      })

      test('a blog can be liked', async ({ page }) => {  
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByText('likes 0')).toBeVisible()// check there are no likes

        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('likes 1')).toBeVisible()// check likes have increased
      })
      test('a blog can be removed by author', async ({ page }) => {      
        await expect(page.getByText('Javascript is great Matti Meikäläinen')).toBeVisible()// check blog is in app

        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async (dialog) => {// handler for windows.confirm
          expect(dialog.message()).toContain('Remove blog Javascript is great by Matti Meikäläinen')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Javascript is great Matti Meikäläinen')).not.toBeVisible()// check blog has been removed
      })
      test('remove button can only be seen by author', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {// add second user
          data: {
            name: 'Petteri',
            username: 'pete',
            password: 'satu'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'pete', 'satu')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('remove')).not.toBeVisible()
      })
      test('blogs are arranged by likes', async ({ page, request }) => {
        // create blogs and like them different amounts
        await createBlog(page, 'Debugging faster', 'Matti Meikäläinen', 'http://forum.com/blogs/5gserfg4524tfg')
        await createBlog(page, 'Playwright makes things easier', 'Meija', 'http://forum.com/blogs/65fsg4w5wfb')
        await createBlog(page, 'Functions are useful', 'Taavi', 'http://forum.com/blogs/456gdfgd45gsg')
        await likeBlog(page, 'Debugging faster', 3)
        await likeBlog(page, 'Playwright makes things easier', 2)
        await likeBlog(page, 'Functions are useful', 1)

        let previousLikes = 0
        const blogs = await page.locator('.blog').all()// get all blogs in a list
        for (let i = 0; i < blogs.length; i++) {// extract likes from a blog and check it has less likes than previous blog
          const content = await blogs[i].textContent()
          const firstIndex = content.indexOf('likes')
          const lastIndex = content.indexOf('like', firstIndex + 1)
          const likes = Number(content.substring(firstIndex + 6, lastIndex))
          if (i > 0) {
            expect(likes <= previousLikes).toBeTruthy()
          } 
          previousLikes = likes
        }
      })
    })
  })
})