import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

router.get("/", (req, res) => {
  conn.query('SELECT * FROM Person', (err, result, fields)=>{
    res.json(result);
  });
});

import { PersonPostRequest } from "../model/body";
import mysql from "mysql";
router.post("/insert", (req, res) => {
  let person: PersonPostRequest = req.body;
  let sql =
    "INSERT INTO `Person`(`person_name`,`person_picture`,`person_age`,`person_info`) VALUES (?,?,?,?)";
  sql = mysql.format(sql, [
    person.person_name,
    person.person_picture,
    person.person_age,
    person.person_info
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows, last_idx: result.insertId });
  });
});

//delete   -----***
router.delete("/delete/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("DELETE FROM Person WHERE person_id = ?", [id], (err, result) => {
     if (err) throw err;
     res
       .status(200)
       .json({ affected_row: result.affectedRows });
  });
});

// //update
router.put("/update/:id", (req, res) => {
  let id = +req.params.id;
  let person: PersonPostRequest = req.body;
  let sql =
    "update  `Person` set `person_name`=?, `person_picture`=?, `person_age`=?, `person_info`=? where `person_id`=?";
  sql = mysql.format(sql, [
    person.person_name,
    person.person_picture,
    person.person_age,
    person.person_info,
    id
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(201)
      .json({ affected_row: result.affectedRows });
  });
});

//show by id
router.get("/show/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("SELECT * FROM Person WHERE person_id = ?" , [id], (err, result, fields) => {
  if (err) throw err;
    res.json(result);
  });
});

//star in movie id
router.get("/star/movie_id/:id", (req, res) => {
  let id = +req.params.id;
  conn.query(
    "SELECT * FROM Person INNER JOIN Star ON Person.person_id = Star.person_id WHERE Star.movie_id = ?",
    [id],
    (err, result, fields) => {
      if (err) throw err;
      res.json(result);
    }
  );
});


// //cast in movie id
router.get("/creator/movie_id/:id", (req, res) => {
  let id = +req.params.id;
  conn.query("SELECT * FROM Person,Creators WHERE Person.person_id = Creators.person_id AND Creators.movie_id = ?" , [id], (err, result, fields) => {
  if (err) throw err;
    res.json(result);
  });
});