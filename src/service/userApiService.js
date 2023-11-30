import db from "../models/index";
import loginRegisterService from "./loginRegisterService";
const getAllUser = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    console.log("=>>>check user: ", users);
    if (users) {
      //   let data = users.get({ plain: true });
      return {
        EM: "get data success",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "get data success",
        EC: 0,
        DT: [],
      };
    }
  } catch (e) {
    console.log(">>>check error", e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;

    let { count, rows } = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["name", "description", "id"] },
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };
    return {
      EM: "fetch Oke La",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const createNewUser = async (data) => {
  console.log(data);
  // check email, phone, hashpass
  try {
    let isEmailExist = await loginRegisterService.checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already existed ",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await loginRegisterService.checkPhoneExist(data.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is already existed ",
        EC: 1,
        DT: "phone",
      };
    }
    // hash userpassword
    let hashPassword = loginRegisterService.hashUserPassword(data.password);
    await db.User.create({ ...data, password: hashPassword });
    return {
      EM: "Create oke",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(">>>check error", e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const updateUser = async (data) => {
  try {
    if (!data.groupId) {
      return {
        EM: "error with empty group ID",
        EC: 1,
        DT: "group",
      };
    }
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      await user.update({
        username: data.username,
        address: data.address,
        sex: data.sex,
        groupId: data.groupId,
      });
      return {
        EM: "update user success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "user not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "Delele user success",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "User not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Error from service",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
};
