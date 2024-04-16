import db from "../models/index";
const getGroupWithRoles = async (user) => {
  let roles = await db.Group.findOne({
    where: { id: user.groupId },
    include: {
      model: db.Role,
      attributes: ["id", "url", "description"],
      through: { attributes: [] }, // để loại bỏ get thuộc tính mà 2 table map chung
    },
  });

  return roles ? roles : {};
};
module.exports = {
  getGroupWithRoles,
};
