const mssql = require("mssql");
const bcrypt = require("bcrypt");

const {
  createPost,
  deletePost,
  updatePost,
  addComment,
  updateComment,
  deleteComment,
  updateUser,
} = require("../Controllers/usersController");

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("updateUser function", () => {
  it("should throw an error if the user is not found", async () => {
    const req = {
      params: {
        id: "hsdh9w98ye",
      },
      body: {},
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [0],
      }),
    });

    await updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });

  it("should update a user successfully", async () => {
    const req = {
      params: {
        id: "45e3b4d1-a80d-49b1-a56d-c1025769ac46",
      },
      body: {
        user_image:
          "https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1885&q=80",
        display_name: "Eminem",
        email: "eminem@gmail.com",
        bio: "rap god",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [1],
      }),
    });

    await updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
    });
  });
});

describe("createPost function", () => {
  it("should throw an error if the post is empty", async () => {
    const req = {
      body: {},
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [0],
      }),
    });

    await createPost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Your post is empty",
    });
  });

  it("should throw an error is the user creating the post is not registered", async () => {
    const req = {
      body: {
        user_id: "nsdwe32r",
        post_content: "post content",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [0],
      }),
    });

    await createPost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "User not found",
    });
  });

  it("should create a post successfully", async () => {
    const req = {
      body: {
        user_id: "de4e2125-be5c-4902-97c2-86126004dac0",
        post_content: "post content",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [1],
      }),
    });

    await createPost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Post created successfully",
    });
  });
});

describe("deletePost function", () => {
  it("should throw an error if the post is not found", async () => {
    const req = {
      params: {
        id: "ug7e79tr977t3",
      },
    };
    await deletePost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Post not found",
    });
  });
});

describe("updatePost function", () => {
  it("should throw an error if the post is empty", async () => {
    const req = {
      params: {
        id: "375076eb-bad5-4b58-8227-611f9fcad22e",
      },
      body: {},
    };

    await updatePost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Your post is empty",
    });
  });
  it("should update a post successfully", async () => {
    const req = {
      params: {
        id: "375076eb-bad5-4b58-8227-611f9fcad22e",
      },
      body: {
        post_content: "updates post content",
      },
    };
    await updatePost(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Post updated successfully",
    });
  });
});

describe("addComment function", () => {
  it("should throw an error if the comment is empty", async () => {
    const req = {
      body: {
        user_id: "de4e2125-be5c-4902-97c2-86126004dac0",
        post_id: "375076eb-bad5-4b58-8227-611f9fcad22e",
        comment_content: "",
      },
    };

    await addComment(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Your comment is empty",
    });
  });

  it("should throw an error if the post is not found", async () => {
    const req = {
      body: {
        user_id: "de4e2125-be5c-4902-97c2-86126004dac0",
        post_id: "387vug349ds",
        comment_content: "Cool",
      },
    };

    await addComment(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Post not found",
    });
  });

  it("should add a comment successfullu", async () => {
    const req = {
      body: {
        user_id: "de4e2125-be5c-4902-97c2-86126004dac0",
        post_id: "375076eb-bad5-4b58-8227-611f9fcad22e",
        comment_content: "Great",
      },
    };

    await addComment(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Comment added successfully",
    });
  });
});

describe("updateComment function", () => {
  it("should throw an error if the comment is empty", async () => {
    const req = {
      params: {
        id: "375076eb-bad5-4b58-8227-611f9fcad22e",
      },
      body: {
        comment_content: "",
      },
    };

    jest.spyOn(mssql, "connect").mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
        rowsAffected: [0],
      }),
    });

    await updateComment(req, res);
    expect(res.json).toHaveBeenCalledWith({
      error: "Your comment is empty",
    });
  });
});

describe("deleteComment function", () => {
  it("should delete comment successfully", async () => {
    const req = {
      params: {
        id: "025983d5-9666-4b0c-b951-d9461fc72f34",
      },
    };
  });
});
