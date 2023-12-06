import roleApiService from "../service/roleApiService";
import userApiService from "../service/userApiService";
const readFunc = async (req, res) => {
  try {
    let data = await roleApiService.getAllRoles();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(">>>check error", e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};
const createFunc = async (req, res) => {
  try {
    let data = await roleApiService.createNewRoles(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>>check error", error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};
// tự làm
const updateFunc = async (req, res) => {
  try {
    try {
      let data = await userApiService.updateUser(req.body);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } catch (error) {
      console.log(">>>check error", error);
      return res.status(500).json({
        EM: "error from server", // error message
        EC: "-1", // error code
        DT: "", // date
      });
    }
  } catch (error) {
    console.log(">>>check error", error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
    s;
  }
};

const deleteFunc = async (req, res) => {
  try {
    let data = await roleApiService.deleteRole(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(">>>check error", error);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
};
