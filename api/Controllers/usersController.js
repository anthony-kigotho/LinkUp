const mssql = require('mssql')
const { v4 } = require('uuid')
const { sqlConfig } = require('../Config/config')

const getUsers = async (req, res) => {
    try 
    {

        const pool = await mssql.connect(sqlConfig)

        const users = await pool.request()
                .execute('get_users')

        res.status(200).json({
            users: users.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getUserByID = async (req, res) => {
    try 
    {
        const { id }= req.params
        const pool = await mssql.connect(sqlConfig)

        // check if user exists
        const user = await pool.request()
            .input('user_id', id)
            .execute('get_user_by_id')
        if(!user.rowsAffected[0]){
            return res.status(404).json({
                error: 'User not found'
            })    
        }

        res.status(200).json({
            user: user.recordset[0]
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id }= req.params
        const { user_image, display_name, email, bio } = req.body

        const pool = await mssql.connect(sqlConfig)

        // check if user exists
        const user = await pool.request()
            .input('user_id', id)
            .execute('get_user_by_id')
        if(!user.rowsAffected[0]){
            return res.status(404).json({
                error: 'User not found'
            })    
        }

        await pool.request()
            .input('user_id', mssql.VarChar, id)
            .input('user_image', mssql.VarChar, user_image)
            .input('display_name', mssql.VarChar, display_name)
            .input('email', mssql.VarChar, email)
            .input('bio', mssql.VarChar, bio)
            .execute('update_user')

        res.status(200).json({
            message: 'User updated successfully'
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
    
}

const getAllFollowers = async (req, res) => {
    try {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const followers = await pool.request()
                .input('following_user_id', mssql.VarChar, id)
                .execute('get_all_followers')

        res.status(200).json({
            followers: followers.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getAllFollowings= async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const followings = await pool.request()
                .input('follower_user_id', mssql.VarChar, id)
                .execute('get_all_followings')

        res.status(200).json({
            followings: followings.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getUsersToFollow= async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const users = await pool.request()
                .input('follower_user_id', mssql.VarChar, id)
                .execute('get_users_to_follow')

        res.status(200).json({
            users: users.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


const getMoreUsersToFollow = async (req, res) => {
    try 
    {
        const { follower_user_id, last_user_id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, follower_user_id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const users = await pool.request()
                .input('follower_user_id', mssql.VarChar, follower_user_id)
                .input('last_user_id', mssql.VarChar, last_user_id)
                .execute('get_more_users_to_follow')

        res.status(200).json({
            users: users.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getFollowersYouDontFollow= async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const followers = await pool.request()
                .input('following_user_id', mssql.VarChar, id)
                .execute('get_followers_you_dont_follow')

        res.status(200).json({
            followers: followers.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getFollowersYouFollow= async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const followers = await pool.request()
                .input('following_user_id', mssql.VarChar, id)
                .execute('get_followers_you_follow')

        res.status(200).json({
            followers: followers.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


const createPost = async (req, res) => {
    try {
        const post_id = v4();
        const { user_id, post_content, post_image } = req.body

        // validating all required fields are filled
        if (!post_content && !post_image) {
            return res.status(400).json({
                error: 'Your post is empty'
            })
        }

        const pool = await mssql.connect(sqlConfig)

        // check if user exists
        const user = await pool.request()
            .input('user_id', user_id)
            .execute('get_user_by_id')
        if(!user.rowsAffected[0]){
            return res.status(404).json({
                error: 'User not found'
            })    
        }

        const post = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .input('user_id', mssql.VarChar, user_id)
                .input('post_content', mssql.VarChar, post_content)
                .input('post_image', mssql.VarChar, post_image)
                .execute('create_post')

        res.status(200).json({
            message: 'Post created successfully'
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


const updatePost = async (req, res) => {
    try {
        const { id }= req.params
        const { post_content, post_image } = req.body

        // validating all required fields are filled
        if (!post_content && !post_image) {
            return res.status(400).json({
                error: 'Your post is empty'
            })
        }

        const pool = await mssql.connect(sqlConfig)

        // checking if post exists
        const post = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('get_post_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        await pool.request()
                .input('post_id', mssql.VarChar, id)
                .input('post_content', mssql.VarChar, post_content)
                .input('post_image', mssql.VarChar, post_image)
                .execute('update_post')

        res.status(200).json({
            message: 'Post updated successfully'
        })

    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
    
}

const getPosts = async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const posts = await pool.request()
                .input('user_id', mssql.VarChar, id)
                .execute('get_posts')

        res.status(200).json({
            posts: posts.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getPostsForFollowing = async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const posts = await pool.request()
                .input('user_id', mssql.VarChar, id)
                .execute('get_posts_for_following')

        res.status(200).json({
            posts: posts.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)

        // checking if post exists
        const post = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('get_post_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('delete_post')

        res.status(200).json({
            message: 'Post deleted successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.body

        const pool = await mssql.connect(sqlConfig)

        
        // checking if post exists
        const post = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('get_post_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        // check if user exists
        const user = await pool.request()
            .input('user_id', user_id)
            .execute('get_user_by_id')
        if(!user.rowsAffected[0]){
            return res.status(404).json({
                error: 'User not found'
            })    
        }

        // TODO: Check if user has already liked
        const postLike = await pool.request()
        .input('post_id', mssql.VarChar, id)
        .input('user_id', mssql.VarChar, user_id)
        .execute('check_post_like')

        if(postLike.recordset[0]) {
            await pool.request()
                .input('post_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('unlike_post')

            return res.status(200).json({
                message: 'Unliked post',
            })
        }

        const post_like_id = v4();

        await pool.request()
                .input('post_like_id', mssql.VarChar, post_like_id)
                .input('post_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('like_post')

        res.status(200).json({
            message: 'Liked post successfully'
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const likeComment = async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.body

        const pool = await mssql.connect(sqlConfig)

        
        // checking if comment exists
        const post = await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .execute('get_comment_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Comment not found'
            })
        }

        // check if user exists
        const user = await pool.request()
            .input('user_id', user_id)
            .execute('get_user_by_id')
        if(!user.rowsAffected[0]){
            return res.status(404).json({
                error: 'User not found'
            })    
        }

        // TODO: Check if user has already liked
        const commentLike = await pool.request()
        .input('comment_id', mssql.VarChar, id)
        .input('user_id', mssql.VarChar, user_id)
        .execute('check_comment_like')

        if(commentLike.recordset[0]) {
            await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('unlike_comment')

            return res.status(200).json({
                message: 'Unliked comment',
            })
        }

        const post_like_id = v4();

        await pool.request()
                .input('comment_like_id', mssql.VarChar, post_like_id)
                .input('comment_id', mssql.VarChar, id)
                .input('user_id', mssql.VarChar, user_id)
                .execute('like_comment')

        res.status(200).json({
            message: 'Liked comment successfully'
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const addComment = async (req, res) => {
    try {
        const comment_id = v4();
        const { user_id, post_id, comment_content, parent_comment_id } = req.body
        
        const pool = await mssql.connect(sqlConfig)
        
        // checking if post exists
        const post = await pool.request()
                .input('post_id', mssql.VarChar, post_id)
                .execute('get_post_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        // validating all required fields are filled
        if (!comment_content) {
            return res.status(400).json({
                error: 'Your comment is empty'
            })
        }


        await pool.request()
                .input('comment_id', mssql.VarChar, comment_id)
                .input('user_id', mssql.VarChar, user_id)
                .input('post_id', mssql.VarChar, post_id)
                .input('comment_content', mssql.VarChar, comment_content)
                .input('parent_comment_id', mssql.VarChar, parent_comment_id)
                .execute('add_comment')

        res.status(200).json({
            message: 'Comment added successfully'
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateComment = async (req, res) => {
    try {
        const { id }= req.params
        const { comment_content} = req.body

        // validating all required fields are filled
        if (!comment_content) {
            return res.status(400).json({
                error: 'Your comment is empty'
            })
        }

        const pool = await mssql.connect(sqlConfig)

        // checking if comment exists
        const post = await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .execute('get_comment_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Comment not found'
            })
        }

        await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .input('comment_content', mssql.VarChar, comment_content)
                .execute('update_comment')

        res.status(200).json({
            message: 'Comment updated successfully'
        })

    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
    
}

const getMainComments = async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if post exists
        const post = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('get_post_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }

        const comments = await pool.request()
                .input('post_id', mssql.VarChar, id)
                .execute('get_main_comments')

        res.status(200).json({
            comments: comments.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getSubComments = async (req, res) => {
    try 
    {
        const { id } = req.params

        const pool = await mssql.connect(sqlConfig)

        // checking if comment exists
        const post = await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .execute('get_comment_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Comment not found'
            })
        }

        const comments = await pool.request()
                .input('parent_comment_id', mssql.VarChar, id)
                .execute('get_sub_comments')

        res.status(200).json({
            comments: comments.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)

        // checking if comment exists
        const post = await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .execute('get_comment_by_id')

        if (!post.recordset[0]) {
            return res.status(404).json({
                error: 'Comment not found'
            })
        }

        await pool.request()
                .input('comment_id', mssql.VarChar, id)
                .execute('delete_comment')

        res.status(200).json({
            message: 'Comment deleted successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const addFollower = async (req, res) => {
    try {
        const { id } = req.params
        const { follower_user_id } = req.body

        const pool = await mssql.connect(sqlConfig)

        if(follower_user_id == id) {
            return res.status(404).json({
                error: 'Cannot follow yourself'
            })
        }
        
        // checking if user exists
        const user = await pool.request()
        .input('user_id', mssql.VarChar, id)
        .execute('get_user_by_id')
        
        if (!user.recordset[0]) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        // TODO: Check if user is already a follower
        const follower = await pool.request()
        .input('following_user_id', id)
        .input('follower_user_id', follower_user_id)
        .execute('check_follow')

        if(follower.recordset[0]) {
            await pool.request()
                .input('following_user_id', mssql.VarChar, id)
                .input('follower_user_id', mssql.VarChar, follower_user_id)
                .execute('remove_follower')

            return res.status(200).json({
                message: 'Unfollowed user',
            })
        } else {          
            const follow_id = v4();    
    
            await pool.request()
                    .input('follow_id', mssql.VarChar, follow_id)
                    .input('following_user_id', mssql.VarChar, id)
                    .input('follower_user_id', mssql.VarChar, follower_user_id)
                    .execute('add_follower')
    
            res.status(200).json({
                message: 'Followed user successfully'
            })

        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const searchUser= async (req, res) => {
    try 
    {
        const { search } = req.params

        const pool = await mssql.connect(sqlConfig)


        const users = await pool.request()
                .input('search_value', mssql.VarChar, search)
                .execute('search_user')

        res.status(200).json({
            users: users.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    getUsers,
    getUserByID,
    updateUser,
    createPost,
    updatePost,
    getPosts,
    getPostsForFollowing,
    deletePost,
    likePost,
    addComment,
    getMainComments,
    getSubComments,
    deleteComment,
    likeComment,
    updateComment,
    addFollower,
    getAllFollowers,
    getAllFollowings,
    getUsersToFollow,
    getMoreUsersToFollow,
    getFollowersYouDontFollow,
    getFollowersYouFollow,
    searchUser
}