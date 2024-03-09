import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('SELECT * FROM Star', (err, result, fields)=>{
      res.json(result);
    });
});

//insert star
import { StarPostRequest } from "../model/body";
import mysql from "mysql";
router.post("/insert", (req, res) => {
  let star: StarPostRequest = req.body;
  let sql =
    "INSERT INTO `Star`(`movie_id`,`person_id`,`role`) VALUES (?,?,?)";
  sql = mysql.format(sql, [ 
    star.movie_id, 
    star.person_id,
    star.role      
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

//delete
router.delete("/delete/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("DELETE FROM Star WHERE star_id = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});

