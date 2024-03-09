import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('SELECT * FROM Creators', (err, result, fields)=>{
      res.json(result);
    });
});

//insert creator
import { CreatorPostRequest } from "../model/body";
import mysql from "mysql";
router.post("/insert", (req, res) => {
  let creator: CreatorPostRequest = req.body;
  let sql =
    "INSERT INTO `Creators`(`movie_id`,`person_id`,`type`) VALUES (?,?,?)";
  sql = mysql.format(sql, [ 
    creator.movie_id,
    creator.person_id,
    creator.type  
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
  conn.query("DELETE FROM Creators WHERE creator_id = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});

