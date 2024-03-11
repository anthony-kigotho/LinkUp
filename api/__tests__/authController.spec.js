const mssql = require("mssql");
const bcrypt = require("bcrypt");
const { registerUser, loginUser } = require("../Controllers/authController");

jest.mock("mssql", () => ({}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("registerUser function", () => {
  // it("should throw an error 'Input all values' if all fields are missing", async () => {
  //   const req = {
  //     body: {},
  //   };

  //   await registerUser(req, res);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "Please input all values",
  //   });
  // });

  it("should register a user successfully", async () => {
    const req = {
      body: {
        display_name: "Hope",
        username: "hope",
        email: "hope@gmail.com",
        password: "Pass1234",
      },
    };

    mssql.connect.mockResolvedValue(pool);

    jest.spyOn(bcrypt, "hash").mockResolvedValueOnce("hashedPassword");

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Account created successfully",
    });
  });

  // it("should return an error if the username is already taken", async () => {
  //   const req = {
  //     body: {
  //       display_name: "Em",
  //       username: "marshall",
  //       email: "em@gmail.com",
  //       password: "Pass1234",
  //     },
  //   };

  //   jest.spyOn(mssql, "connect").mockResolvedValueOnce({
  //     request: jest.fn().mockReturnThis(),
  //     input: jest.fn().mockReturnThis(),
  //     execute: jest.fn().mockResolvedValueOnce({
  //       rowsAffected: [0],
  //     }),
  //   });

  //   await registerUser(req, res);
  //   expect(res.json).toHaveBeenCalledWith({
  //     error: "Account creation failed",
  //   });
  // });
});

// describe("loginUser function", () => {
//   it("should login a user successfully", async () => {
//     const req = {
//       body: {
//         username: "tony",
//         password: "Pass1234",
//       },
//     };

//     const expectedUser = {
//       user_id: "99f32f04-caab-43d2-a210-6bdf0a3320c4",
//       username: "tony",
//       password: "hashedPassword",
//     };

//     jest.spyOn(mssql, "connect").mockResolvedValueOnce({
//       request: jest.fn().mockReturnThis(),
//       input: jest.fn().mockReturnThis(),
//       execute: jest.fn().mockResolvedValueOnce({
//         rowsAffected: [1],
//         recordset: [expectedUser],
//       }),
//     });

//     jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);

//     await loginUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//   });

//   it("should throw an error if all fields are missing", async () => {
//     const req = {
//       body: {},
//     };

//     jest.spyOn(mssql, "connect").mockResolvedValueOnce({
//       request: jest.fn().mockReturnThis(),
//       input: jest.fn().mockReturnThis(),
//       execute: jest.fn().mockResolvedValueOnce({
//         rowsAffected: [0],
//       }),
//     });

//     await loginUser(req, res);
//     expect(res.json).toHaveBeenCalledWith({
//       error: "All fields are required",
//     });
//   });

//   it("should return an error if the username is not registered", async () => {
//     const req = {
//       body: {
//         username: "tser",
//         password: "Pass1234",
//       },
//     };

//     await loginUser(req, res);

//     expect(res.json).toHaveBeenCalledWith({
//       error: "This username is not registered",
//     });
//   });

//   it("should return an error if the password is wrong", async () => {
//     const req = {
//       body: {
//         username: "tony",
//         password: "wrongpass",
//       },
//     };

//     await loginUser(req, res);

//     expect(res.json).toHaveBeenCalledWith({
//       error: "Invalid login credentials",
//     });
//   });
// });
