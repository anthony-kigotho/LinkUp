CREATE TABLE "follows"(
    "follow_id" VARCHAR(255) NOT NULL,
    "following_user_id" VARCHAR(255) NOT NULL,
    "follower_user_id" VARCHAR(255) NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "follows" ADD CONSTRAINT "follows_follow_id_primary" PRIMARY KEY("follow_id");
CREATE TABLE "post_likes"(
    "post_like_id" VARCHAR(255) NOT NULL,
    "post_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "post_likes" ADD CONSTRAINT "post_likes_post_like_id_primary" PRIMARY KEY("post_like_id");
CREATE TABLE "comments_likes"(
    "comment_like_id" VARCHAR(255) NOT NULL,
    "comment_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "comments_likes" ADD CONSTRAINT "comments_likes_comment_like_id_primary" PRIMARY KEY("comment_like_id");
CREATE TABLE "users"(
    "user_id" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "bio" VARCHAR(255) NULL,
    "user_image" VARCHAR(255) NOT NULL DEFAULT 'https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1885&q=80',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_id_primary" PRIMARY KEY("user_id");
CREATE TABLE "comments"(
    "comment_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "post_id" VARCHAR(255) NOT NULL,
    "comment_content" VARCHAR(255) NOT NULL,
    "parent_comment_id" VARCHAR(255) NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_comment_id_primary" PRIMARY KEY("comment_id");
CREATE TABLE "posts"(
    "post_id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "post_content" VARCHAR(255) NOT NULL,
    "post_image" VARCHAR(255) NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_post_id_primary" PRIMARY KEY("post_id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_parent_comment_id_foreign" FOREIGN KEY("parent_comment_id") REFERENCES "comments"("comment_id");
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("user_id");
ALTER TABLE
    "follows" ADD CONSTRAINT "follows_following_user_id_foreign" FOREIGN KEY("following_user_id") REFERENCES "users"("user_id");
ALTER TABLE
    "comments_likes" ADD CONSTRAINT "comments_likes_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("user_id");
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("user_id");
ALTER TABLE
    "comments_likes" ADD CONSTRAINT "comments_likes_comment_id_foreign" FOREIGN KEY("comment_id") REFERENCES "comments"("comment_id") ON DELETE CASCADE;
ALTER TABLE
    "comments" ADD CONSTRAINT "comments_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "posts"("post_id");
ALTER TABLE
    "post_likes" ADD CONSTRAINT "post_likes_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("user_id");
ALTER TABLE
    "post_likes" ADD CONSTRAINT "post_likes_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "posts"("post_id");
ALTER TABLE
    "follows" ADD CONSTRAINT "follows_follower_user_id_foreign" FOREIGN KEY("follower_user_id") REFERENCES "users"("user_id");