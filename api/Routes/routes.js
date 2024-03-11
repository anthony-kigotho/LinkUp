const {Router} = require('express');
;
const { registerUser, loginUser } = require('../Controllers/authController');
const { createPost, deletePost, addComment, deleteComment, addFollower, likePost, likeComment, updateUser, getAllFollowers, getAllFollowings, getFollowersYouFollow, getFollowersYouDontFollow, searchUser, getUsersToFollow, getPosts, getMainComments, getSubComments, getUsers, getMoreUsersToFollow, getPostsForFollowing, updatePost, updateComment, getUserByID } = require('../Controllers/usersController');
const { verifyToken } = require('../Middleware/verifyToken');
const userRouter = Router();

//Authentication
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Posts
userRouter.post('/post', createPost);
userRouter.put('/post/update/:id', updatePost);
userRouter.get('/posts/:id', getPosts);
userRouter.get('/following/posts/:id', getPostsForFollowing);
userRouter.delete('/post/delete/:id', deletePost);
userRouter.post('/post/like/:id', likePost);
userRouter.post('/post/comment/', addComment);
userRouter.put('/post/comment/update/:id', updateComment);
userRouter.get('/post/main-comments/:id', getMainComments);
userRouter.get('/post/sub-comments/:id', getSubComments);
userRouter.delete('/comment/delete/:id', deleteComment);
userRouter.post('/comment/like/:id', likeComment);

// Users
userRouter.get('/', getUsers);
userRouter.get('/get/:id', getUserByID);
userRouter.put('/update/:id', updateUser);
userRouter.post('/follow/:id', addFollower)
userRouter.get('/followers/:id', getAllFollowers)
userRouter.get('/followings/:id', getAllFollowings)
userRouter.get('/users-to-follow/:id', getUsersToFollow)
userRouter.get('/show-more-users/:follower_user_id/:last_user_id', getMoreUsersToFollow)
userRouter.get('/followers-you-follow/:id', getFollowersYouFollow)
userRouter.get('/followers-you-dont-follow/:id', getFollowersYouDontFollow)
userRouter.get('/:search', searchUser)


module.exports = {
    userRouter
}
