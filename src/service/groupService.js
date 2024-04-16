import db from "../models";

const getGroups = async () => {
  try {
    let data = await db.Group.findAll({
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ["name", "ASC"],
      ],
    });
    return {
      EM: "Get groups success",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log("=>> check error", error);
    return {
      EM: "error from service",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  getGroups,
};
