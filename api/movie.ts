import express from "express";
import { conn } from "../dbconnect";
export const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Get in movie.ts");
// });

router.post("/", (req, res) => {
    let body = req.body; 
    res.send("Get in movie.ts body: " + JSON.stringify(body));
});

//show all
router.get("/show", (req, res) => {
    conn.query('SELECT * FROM Movie', (err, result, fields)=>{
      res.json(result);
    });
});
//show by id
router.get("/show/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("SELECT * FROM Movie WHERE movie_id = ?" , [id], (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    });
});

//Movie insert
import { MoviePostRequest } from "../model/body";
import mysql from "mysql";
router.post("/insert", (req, res) => {
    let movie: MoviePostRequest = req.body;
    let sql =
      "INSERT INTO `Movie`(`movie_name`, `movie_picture`, `movie_rating`, `movie_detail`, `movie_time`, `movie_vdo`) VALUES (?,?,?,?,?,?)";
    sql = mysql.format(sql, [
      movie.movie_name,
      movie.movie_picture,
      movie.movie_rating,
      movie.movie_detail,
      movie.movie_time,
      movie.movie_vdo
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });
// delete
router.delete("/delete/:id", (req, res) => {
    let id = +req.params.id;

    conn.query("DELETE FROM Movie_type WHERE movie_id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error deleting Movie_type:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        deleteStar();
    });
    function deleteStar() {
        conn.query("DELETE FROM Star WHERE movie_id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error deleting Star:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            deleteCreators();
        });
    }
    function deleteCreators() {
        conn.query("DELETE FROM Creators WHERE movie_id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error deleting Creators:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            deleteMovie();
        });
    }
    function deleteMovie() {
        conn.query("DELETE FROM Movie WHERE movie_id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error deleting Movie:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.status(200).json({ affected_rows: result.affectedRows });
        });
    }
});


// //update
router.put("/update/:id", (req, res) => {
    let id = +req.params.id;
    let movie: MoviePostRequest = req.body;
    let sql =
      "update  `Movie` set `movie_name`=?, `movie_picture`=?, `movie_rating`=?, `movie_detail`=?, `movie_time`=? , `movie_vdo`=? where `movie_id`=?";
    sql = mysql.format(sql, [
        movie.movie_name,
        movie.movie_picture,
        movie.movie_rating,
        movie.movie_detail,
        movie.movie_time,
        movie.movie_vdo,
        id
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows });
    });
  });

//id or name-----------------------------
router.get("/search/fields", (req, res) => {
  conn.query(
    "select * from Movie where (movie_id IS NULL OR movie_id = ?) OR (movie_name IS NULL OR movie_name like ?)",
    [ req.query.movie_id, "%" + req.query.movie_name + "%"],
    (err, result, fields) => {
    if (err) throw err;
      res.json(result);
    }
  );
});


import { MovieResult } from "../model/body";
// Search for movies by name and retrieve associated stars and creators
router.get("/search/name", (req, res) => {
  const movieName = req.query.movie_name;

  // Search for movies by name and retrieve associated types
  conn.query(
    "SELECT Movie.movie_id, Movie.movie_name, Movie.movie_picture, Movie.movie_rating, Movie.movie_vdo, Movie.movie_detail, Movie.movie_time, GROUP_CONCAT(DISTINCT Movie_type.type) AS type " +
    "FROM Movie " +
    "INNER JOIN Movie_type ON Movie.movie_id = Movie_type.movie_id " +
    "WHERE Movie.movie_name LIKE ? " +
    "GROUP BY Movie.movie_id",
    ["%" + movieName + "%"],
    (err, movieResult: MovieResult[]) => {
      if (err) throw err;

      // Check if any movies are found
      if (movieResult.length > 0) {
        // Retrieve stars for the found movie(s)
        conn.query(
          "SELECT Person.*, Star.role FROM Person INNER JOIN Star ON Person.person_id = Star.person_id WHERE Star.movie_id IN (?)",
          [movieResult.map(movie => movie.movie_id)],
          (err, starResult) => {
            if (err) throw err;

            // Retrieve creators for the found movie(s)
            conn.query(
              "SELECT Person.*, Creators.type FROM Person INNER JOIN Creators ON Person.person_id = Creators.person_id WHERE Creators.movie_id IN (?)",
              [movieResult.map(movie => movie.movie_id)],
              (err, creatorResult) => {
                if (err) throw err;

                // Combine all results
                const combinedResult = {
                  movies: movieResult,
                  stars: starResult,
                  creators: creatorResult
                };

                // Send combined result
                res.json(combinedResult);
              }
            );
          }
        );
      } else {
        // If no movies found, send an empty result
        res.json({ movies: [], stars: [], creators: [] });
      }
    }
  );
});
