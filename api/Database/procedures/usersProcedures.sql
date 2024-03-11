-- get users
CREATE OR ALTER PROCEDURE get_users
AS
BEGIN
    SELECT * FROM users;
END;
GO

-- get user by username
CREATE OR ALTER PROCEDURE fetchUserByUsername
    @username VARCHAR(255)
AS
BEGIN
    SELECT * FROM users WHERE username = @username;
END;
GO

-- get user by email
CREATE OR ALTER PROCEDURE fetchUserByEmail
    @email VARCHAR(255)
AS
BEGIN
    SELECT * FROM users WHERE email = @email;
END
GO

-- get all followers
CREATE OR ALTER PROCEDURE get_all_followers
    @following_user_id VARCHAR(255)
AS
BEGIN
    SELECT follower_user_id FROM follows WHERE following_user_id = @following_user_id;
END;
GO


-- get all followings
CREATE OR ALTER PROCEDURE get_all_followings
    @follower_user_id VARCHAR(255)
AS
BEGIN
    SELECT u.user_id, u.user_image, u.username, u.display_name, u.bio
    FROM follows f
    INNER JOIN users u ON f.following_user_id = u.user_id
    WHERE f.follower_user_id = @follower_user_id;
END;
GO


-- get all users you are not following
CREATE OR ALTER PROCEDURE get_users_to_follow
    @follower_user_id VARCHAR(255)
AS
BEGIN
    SELECT TOP(1) user_id, user_image, display_name, username
    FROM users
    WHERE user_id NOT IN (
        SELECT following_user_id
        FROM follows
        WHERE follower_user_id = @follower_user_id
    )
    AND user_id != @follower_user_id
    ORDER BY user_id
END;
GO

-- get more users to follow
CREATE OR ALTER PROCEDURE get_more_users_to_follow
    @follower_user_id VARCHAR(255),
    @last_user_id VARCHAR(255),
    @PageSize INT = 1 -- The default page size is set to 10
AS
BEGIN
    -- Fetch the next set of users to follow
    SELECT TOP (@PageSize) user_id, user_image, display_name, username
    FROM users
    WHERE user_id NOT IN (
        SELECT following_user_id
        FROM follows
        WHERE follower_user_id = @follower_user_id
    )
    AND user_id != @follower_user_id
    AND user_id > @last_user_id -- Assuming user_id is numeric or comparable
    ORDER BY user_id;
END;
GO




-- get all followers you don't follow back
CREATE OR ALTER PROCEDURE get_followers_you_dont_follow
    @following_user_id VARCHAR(255)
AS
BEGIN
    SELECT FollowerUsers.user_id, FollowerUsers.user_image, FollowerUsers.display_name, FollowerUsers.username, FollowerUsers.bio
    FROM follows
    JOIN users AS FollowerUsers ON follows.follower_user_id = FollowerUsers.user_id
    WHERE follows.following_user_id = @following_user_id
    AND follows.follower_user_id NOT IN (
        SELECT following_user_id
        FROM follows
        WHERE follower_user_id = @following_user_id
    );

END;
GO

-- get all followers you follow back
CREATE OR ALTER PROCEDURE get_followers_you_follow
    @following_user_id VARCHAR(255)
AS
BEGIN
    SELECT FollowerUsers.user_id, FollowerUsers.user_image, FollowerUsers.display_name, FollowerUsers.username, FollowerUsers.bio
    FROM follows
    JOIN users AS FollowerUsers ON follows.follower_user_id = FollowerUsers.user_id
    WHERE follows.following_user_id = @following_user_id
    AND follows.follower_user_id IN (
        SELECT following_user_id
        FROM follows
        WHERE follower_user_id = @following_user_id
    );

END;
GO




--create a new user
CREATE OR ALTER PROCEDURE createNewUser
    @user_id VARCHAR(255),
    @display_name VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    INSERT INTO users(user_id, display_name, username, email, password) 
    VALUES (@user_id, @display_name, @username, @email, @password)
END
GO

--update user
CREATE OR ALTER PROCEDURE update_user
    @user_id VARCHAR(255),
    @user_image VARCHAR(255),
    @display_name VARCHAR(255),
    @email VARCHAR(255),
    @bio VARCHAR(255)
AS
BEGIN
    UPDATE users SET user_image=@user_image, display_name=@display_name, email = @email, bio=@bio
    WHERE user_id = @user_id
END
GO

-- get user by id
CREATE OR ALTER PROCEDURE get_user_by_id
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM users WHERE user_id = @user_id;
END;
GO


-- create a post
CREATE OR ALTER PROCEDURE create_post
    @post_id VARCHAR(255),
    @user_id VARCHAR(255),
    @post_content VARCHAR(255),
    @post_image VARCHAR(255)
AS
BEGIN
    INSERT INTO posts (post_id, user_id, post_content, post_image)
    VALUES (@post_id, @user_id, @post_content, @post_image);
END;
GO


--update post
CREATE OR ALTER PROCEDURE update_post
    @post_id VARCHAR(255),
    @post_content VARCHAR(255),
    @post_image VARCHAR(255)
AS
BEGIN
    UPDATE posts SET post_content=@post_content, post_image=@post_image
    WHERE post_id = @post_id
END
GO

-- get posts
CREATE OR ALTER PROCEDURE get_posts
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT p.*, u.display_name, u.username, u.user_image, COALESCE(pl.likes_count, 0) AS likes_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.user_id
    LEFT JOIN (
        SELECT post_id, COUNT(*) AS likes_count
        FROM post_likes
        GROUP BY post_id
    ) pl ON p.post_id = pl.post_id
    WHERE p.user_id = @user_id
    ORDER BY p.created_at DESC;
END;
GO


CREATE OR ALTER PROCEDURE get_posts_for_following
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT p.*, u.display_name, u.username, u.user_image, COALESCE(pl.likes_count, 0) AS likes_count
    FROM posts p
    INNER JOIN follows f ON p.user_id = f.following_user_id
    INNER JOIN users u ON p.user_id = u.user_id
    LEFT JOIN (
        SELECT post_id, COUNT(*) AS likes_count
        FROM post_likes
        GROUP BY post_id
    ) pl ON p.post_id = pl.post_id
    WHERE f.follower_user_id = @user_id
    ORDER BY p.created_at DESC;
END;
GO



-- get post by id
CREATE OR ALTER PROCEDURE get_post_by_id
    @post_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM posts WHERE post_id = @post_id;
END;
GO

-- delete post
CREATE OR ALTER PROCEDURE delete_post
    @post_id VARCHAR(255)
AS
BEGIN
    DELETE FROM posts WHERE post_id = @post_id;
END;
GO


-- add a comment
CREATE OR ALTER PROCEDURE add_comment
    @comment_id VARCHAR(255),
    @user_id VARCHAR(255),
    @post_id VARCHAR(255),
    @comment_content VARCHAR(255),
    @parent_comment_id VARCHAR(255)
AS
BEGIN
    INSERT INTO comments (comment_id, user_id, post_id, comment_content, parent_comment_id)
    VALUES (@comment_id, @user_id, @post_id, @comment_content, @parent_comment_id);
END;
GO

--update comment
CREATE OR ALTER PROCEDURE update_comment
    @comment_id VARCHAR(255),
    @comment_content VARCHAR(255)
AS
BEGIN
    UPDATE comments SET comment_content=@comment_content
    WHERE comment_id = @comment_id
END;
GO

-- get comment by id
CREATE OR ALTER PROCEDURE get_comment_by_id
    @comment_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM comments WHERE comment_id = @comment_id;
END;
GO

-- get main comments
CREATE OR ALTER PROCEDURE get_main_comments
    @post_id VARCHAR(255)
AS
BEGIN
    SELECT c.*, u.display_name, u.username, u.user_image, COALESCE(cl.likes_count, 0) AS likes_count
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    LEFT JOIN (
        SELECT comment_id, COUNT(*) AS likes_count
        FROM comments_likes
        GROUP BY comment_id
    ) cl ON c.comment_id = cl.comment_id
    WHERE c.post_id = @post_id AND c.parent_comment_id IS NULL;
END;
GO

-- get sub comments
CREATE OR ALTER PROCEDURE get_sub_comments
    @parent_comment_id VARCHAR(255)
AS
BEGIN
    SELECT c.*, u.display_name, u.username, u.user_image, COALESCE(cl.likes_count, 0) AS likes_count
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.user_id
    LEFT JOIN (
        SELECT comment_id, COUNT(*) AS likes_count
        FROM comments_likes
        GROUP BY comment_id
    ) cl ON c.comment_id = cl.comment_id
    WHERE c.parent_comment_id = @parent_comment_id;
END;
GO


-- delete comment
CREATE OR ALTER PROCEDURE delete_comment
    @comment_id VARCHAR(255)
AS
BEGIN
    DELETE FROM comments WHERE comment_id = @comment_id OR parent_comment_id = @comment_id;
END;
GO

-- add follower
CREATE OR ALTER PROCEDURE add_follower
    @follow_id VARCHAR(255),
    @following_user_id VARCHAR(255),
    @follower_user_id VARCHAR(255)
AS
BEGIN
    INSERT INTO follows (follow_id, following_user_id, follower_user_id)
    VALUES(@follow_id, @following_user_id, @follower_user_id)
END;
GO


-- remove follower
CREATE OR ALTER PROCEDURE remove_follower
    @following_user_id VARCHAR(255),
    @follower_user_id VARCHAR(255)
AS
BEGIN
    DELETE FROM follows WHERE following_user_id = @following_user_id AND follower_user_id = @follower_user_id
END;
GO


-- check if follower exists
CREATE OR ALTER PROCEDURE check_follow
    @following_user_id VARCHAR(255),
    @follower_user_id VARCHAR(255)
AS
BEGIN
    SELECT 1 FROM follows WHERE following_user_id = @following_user_id
    AND follower_user_id = @follower_user_id
END;
GO

-- check if comment like exists
CREATE OR ALTER PROCEDURE check_comment_like
    @comment_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT 1 FROM comments_likes WHERE comment_id = @comment_id
    AND user_id = @user_id
END;
GO

-- like comment
CREATE OR ALTER PROCEDURE like_comment
    @comment_like_id VARCHAR(255),
    @comment_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    INSERT INTO comments_likes (comment_like_id, comment_id, user_id)
    VALUES (@comment_like_id, @comment_id, @user_id)
END;
GO

-- unlike comment
CREATE OR ALTER PROCEDURE unlike_comment
    @comment_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    DELETE FROM comments_likes WHERE comment_id = @comment_id AND user_id = @user_id
END;
GO

-- check if post like exists
CREATE OR ALTER PROCEDURE check_post_like
    @post_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    SELECT 1 FROM post_likes WHERE post_id = @post_id
    AND user_id = @user_id
END;
GO

-- like post
CREATE OR ALTER PROCEDURE like_post
    @post_like_id VARCHAR(255),
    @post_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    INSERT INTO post_likes (post_like_id, post_id, user_id)
    VALUES(@post_like_id, @post_id, @user_id)
END;
GO

-- unlike post
CREATE OR ALTER PROCEDURE unlike_post
    @post_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    DELETE FROM post_likes WHERE post_id = @post_id AND user_id = @user_id
END;
GO


-- search user
CREATE OR ALTER PROCEDURE search_user
    @search_value VARCHAR(255)
AS
BEGIN
    SELECT user_id, user_image, display_name, username
    FROM users
    WHERE display_name LIKE @search_value+'%' OR username LIKE @search_value+'%';
END;
GO
