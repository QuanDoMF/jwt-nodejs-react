import loginRegisterService from "../service/loginRegisterService";

const testApi = (req, res) => {
  return res.status(200).json({
    message: "ok",
    data: "test api",
  });
};
const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.phone || !req.body.password) {
      return res.status(200).json({
        EM: "Missing required parameters", // error message
        EC: "1", // error code
        DT: "", // date
      });
    }

    if (req.body.password && req.body.password < 3) {
      return res.status(200).json({
        EM: "Your password must have more than 3 letters", // error message
        EC: "1", // error code
        DT: "", // date
      });
    }
    // service: create user
    let data = await loginRegisterService.registerNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (e) {
    console.log("check error", e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};
const handleLogin = async (req, res) => {
  try {
    let data = await loginRegisterService.handleUserLogin(req.body);

    // set cookie: key, value, option(phía client mới đọc được)
    if (data && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM, // error message
      EC: data.EC, // error code
      DT: data.DT, // date
    });
  } catch (e) {
    console.log("check error", e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({
      EM: "clear cookies done", // error message
      EC: 0, // error code
      DT: "", // date
    });
  } catch (e) {
    console.log("check error", e);
    return res.status(500).json({
      EM: "error from server", // error message
      EC: "-1", // error code
      DT: "", // date
    });
  }
};

module.exports = {
  testApi,
  handleRegister,
  handleLogin,
  handleLogout,
};
