import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('SELECT * FROM Movie_type', (err, result, fields)=>{
      res.json(result);
    });
});

//insert movie_type
import { TypePostRequest } from "../model/body";
import mysql from "mysql";
router.post("/insert", (req, res) => {
  let type_in: TypePostRequest = req.body;
  let sql =
    "INSERT INTO `Movie_type`(`movie_id`,`type`) VALUES (?,?)";
  sql = mysql.format(sql, [
    type_in.movie_id,
    type_in.type,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

//delete
// router.delete("/delete/:id"
router.delete("/delete", (req, res) => {
    let type_in: TypePostRequest = req.body;
    let sql =
      "DELETE  FROM  Movie_type WHERE movie_id = ? AND type = ?";
    sql = mysql.format(sql, [
      type_in.movie_id,
      type_in.type,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });