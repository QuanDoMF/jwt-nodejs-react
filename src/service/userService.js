import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import bluebird from "bluebird";
import db from "../models";
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);

  return hashPassword;
};
// test connectDB

const createNewUser = async (email, password, username) => {
  let hashPass = hashUserPassword(password);

  try {
    await db.User.create({
      username: username,
      email: email,
      password: hashPass,
    });
  } catch (error) {
    console.log("check error", error);
  }
};

const getUserList = async () => {
  // const connection = await mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   database: "jwt",
  //   Promise: bluebird,
  // });
  // let user = [];
  // try {
  //   const [rows, fields] = await connection.execute("SELECT * FROM user");
  //   return rows;
  // } catch (error) {
  //   console.log(">> check error", error);
  // }
  let users = [];
  users = await db.User.findAll();
  return users;
};

const deleteUser = async (userId) => {
  await db.User.destroy({
    where: { id: userId },
  });
  // DELETE FROM user WHERE id;
  // const connection = await mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   database: "jwt",
  //   Promise: bluebird,
  // });
  // let user = [];
  // try {
  //   const [rows, fields] = await connection.execute(
  //     "DELETE FROM user WHERE id=?",
  //     [id]
  //   );
  // } catch (error) {
  //   console.log(">> check error", error);
  // }
};
const getUserById = async (id) => {
  let user = {};
  user = await db.User.findOne({
    where: { id: id },
  });
  return user.toJSON(); // nếu không toJSON nó sẽ trả về dạng kiểu user là một model có nhiều thông tin
  // khiến không truy xuất vào được tham só cần dùng

  // const connection = await mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   database: "jwt",
  //   Promise: bluebird,
  // });
  // try {
  //   const [rows, fields] = await connection.execute(
  //     "Select * FROM user WHERE id=?",
  //     [id]
  //   );
  //   console.log(">>> check row", rows);

  //   return rows;
  // } catch (error) {
  //   console.log(">> check error", error);
  // }
};

const updateUserInfor = async (email, username, id) => {
  await db.User.update(
    { email: email, username: username },
    { where: { id: id } }
  );
  // const connection = await mysql.createConnection({
  //   host: "localhost",
  //   user: "root",
  //   database: "jwt",
  //   Promise: bluebird,
  // });
  // try {
  //   const [rows, fields] = await connection.execute(
  //     " UPDATE user SET email = ?, username = ? WHERE id = ?;",
  //     [email, username, id]
  //   );
  //   console.log(">>> check row", rows);

  //   return rows;
  // } catch (error) {
  //   console.log(">> check error", error);
  // }
};
module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserById,
  updateUserInfor,
};
