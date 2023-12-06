import db from "../models";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTAction";
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};
// t

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true; // email tồn tại
  } else {
    return false; // email chưa tồn tại
  }
};

const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true; // email tồn tại
  } else {
    return false; // email chưa tồn tại
  }
};

const registerNewUser = async (rawUserData) => {
  // check email/phonenumber are exist (tồn tại)
  try {
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already existed ",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is already existed ",
        EC: 1,
      };
    }
    // hash userpassword
    let hashPassword = hashUserPassword(rawUserData.password);

    //create new user
    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.username,
      password: hashPassword,
      phone: rawUserData.phone,
      groupId: 4,
    });
    return {
      EM: "A user is created successfully!",
      EC: 0,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs in service...",
      EC: -2,
    };
  }
};

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword); // so sánh mk nhập vào và mk đã hash ở db(true/false)
};

const handleUserLogin = async (rawData) => {
  try {
    // check email/phone are exist
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });
    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        // let token
        let groupWithRoles = await getGroupWithRoles(user);
        let payload = {
          email: user.email,
          groupWithRoles,
          username: user.username,
        };
        let token = createJWT(payload);
        return {
          EM: "Ok!",
          EC: 0,
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            username: user.username,
          },
        };
      }
    }

    return {
      EM: "Your email/phone number or password incorrect",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs in service...",
      EC: -2,
    };
  }
  // if (isEmailExist === false) {
  //   return {
  //     EM: "The email is already existed ",
  //     EC: 1,
  //     DT: "",
  //   };
  // }

  // let isPhoneExist = await checkPhoneExist(rawUserData.phone);
  // if (isPhoneExist === true) {
  //   return {
  //     EM: "The phone number is already existed ",
  //     EC: 1,
  //     DT: "",
  //   };
  // }
};
module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
};
