const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllBlogsController, addBlogController, updateBlogController, getABlogWithIdController, deleteBlogController, getAllBlogsAddedByAUserController } = require('../Controller/blogController')

const router = express.Router()

//route for getting all blogs
router.get('/all-blogs',authMiddleware,getAllBlogsController)

//route for getting a blog with id
router.get('/:id', authMiddleware, getABlogWithIdController)

//route for getting the blogs added ny a particular user
router.get('/user/all-blogs/:id',authMiddleware,getAllBlogsAddedByAUserController)

//route for deleting a blog
router.delete('/delete-blog/:id', authMiddleware, deleteBlogController)



module.exports = router