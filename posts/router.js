const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.insert({ title, contents })
      .then(posts => {
        res.status(201).json(posts);
      })
      .catch(() => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        res.json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Posts.findById(id)
    .then(post => {
      if (post.length > 0) {
        Posts.remove(id)
          .then(() => {
            res.json(post);
          })
          .catch(() => {
            res.status(500).json({ message: "Failed to delete Post" });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    Posts.findById(id)
      .then(post => {
        if (post.length > 0) {
          Posts.update(id, { title, contents }).then(post => {
            if (post === 1) {
              Posts.findById(id).then(post => {
                res.json(post);
              });
            } else {
              res.status(404).json({ message: "failed to update post" });
            }
          });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
        }
      })

      .catch(() => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});
module.exports = router;
