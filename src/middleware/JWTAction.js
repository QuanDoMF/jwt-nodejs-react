require("dotenv").config();
import jwt from "jsonwebtoken";

// những path mà k bắt check jwt
const nonSecurePaths = ["/", "/login", "/register", "/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRESIN });
  } catch (err) {
    console.log(err);
  }
  return token;
};
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();
  let cookies = req.cookies;
  const tokenFromHeader = extractToken(req);

  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EM: "not authenticated the user",
        EC: -1,
        DT: "",
      });
    }
  }
  if (tokenFromHeader) {
  } else {
    return res.status(401).json({
      EM: "not authenticated the user",
      EC: -1,
      DT: "",
    });
  }
};
const checkUserPermission = (req, res, next) => {
  if (
    nonSecurePaths.includes(req.path) ||
    req.path === "/account" ||
    req.path === "/group/read"
  )
    return next();

  if (req.user) {
    // console.log(req.user);
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentUrl = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EM: `you don't have permisson to access this resource...`,
        EC: -1,
        DT: "",
      });
    }
    let canAccess = roles.some((item) => currentUrl.startsWith(item.url));
    if (canAccess === true) {
      next();
    } else {
      return res.status(403).json({
        EM: `you don't have permisson to access this resource...`,
        EC: -1,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EM: "not aithenticated the user",
      EC: -1,
      DT: "",
    });
  }
};
module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
