import express from "express";

/**
 *
 * @pram {*} app - express app
 */

const configViewEngine = (app) => {
  app.use(express.static("public"));
  app.set("view engine", "ejs");
  app.set("view", "./src/view");
};

export default configViewEngine;
