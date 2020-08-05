const express = require("express");
const jwt = require("jsonwebtoken");
const Room = require("../models/Room");
const Question = require("../models/Question");
const User = require("../models/User");
const Answer = require("../models/Answer");

const router = express.Router();

// Get all Rooms
router.get("/", async (req, res) => {
  try {
    let allRooms = await Room.find()
      .populate("admin")
      .sort({ createdAt: "desc" })
      .lean();
    for (let obj of allRooms) {
      delete obj.admin.password;
    }
    res.status(200).json(allRooms);
  } catch (error) {
    console.error(error);
  }
});

// CREATING A ROOM
router.post("/create", authenticateUser, async (req, res) => {
  const { username, title } = req.body;
  try {
    let user = await User.findOne({ name: username }).lean();
    let userID = user && user._id;
    if (userID) {
      let rooms = await Room.findOne({ title: title });
      if (rooms) {
        res.json({ msg: "Enter a different Room Title" });
      } else {
        await Room.create({ title: title, admin: userID }, () => {
          res.status(201).json({ msg: "room created" });
        });
      }
    } else {
      res.json({ msg: "Invalid Data" });
    }
  } catch (error) {
    console.error(error);
  }
});

// DELETE A ROOM
router.delete("/:name", authenticateUser, async (req, res) => {
  try {
    const roomName = req.params.name;
    const reqName = req.body.name;
    const room = await Room.findOne({ title: roomName })
      .populate("admin")
      .lean();
    if (!room) res.json({ msg: "No room" });
    const storyAdminName = room.admin.name;
    if (reqName === storyAdminName) {
      await Room.findOneAndDelete({ title: roomName }, (err, response) => {
        if (err) {
          console.error(err);
        } else {
          res.json({ msg: `${roomName} has been deleted!!` });
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// ENTERING A SINGLE ROOM
router.get("/:name", authenticateUser, async (req, res) => {
  const roomName = req.params.name;
  try {
    let room = await Room.findOne({ title: roomName }).lean();
    if (!room) {
      res.sendStatus(404);
    } else {
      let roomID = room && room._id;
      let relatedQuestions = await Question.find({ room: roomID })
        .sort({ createdAt: "desc" })
        .lean();
      for (let question of relatedQuestions) {
        let questionObj = question;
        let questionID = question._id;
        let questionRelatedAns = await Answer.find({ question: questionID })
          .sort({ createdAt: "desc" })
          .lean();
        if (questionRelatedAns) {
          questionObj.answers = questionRelatedAns;
          question = questionObj;
        }
      }
      res.json(relatedQuestions).status(200)
      console.log(JSON.stringify(relatedQuestions, null, 5))
    }
  } catch (error) {
    console.error(error);
  }
});

// CREATING QUESTIONS
router.post("/:name/create-question", authenticateUser, async (req, res) => {
  const roomName = req.params.name;
  const questionTitle = req.body.question;
  try {
    let room = await Room.findOne({ title: roomName }).lean();
    let roomID = room && room._id;
    let questionDoesExist = await Question.findOne({
      title: questionTitle,
      room: roomID,
    });
    if (questionDoesExist) {
      res.json({ msg: "Question Does Exist" });
    } else {
      await Question.create(
        { title: questionTitle, room: roomID },
        (err, response) => {
          err ? console.error(err) : res.json({ msg: "Question Added" });
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
});

// DELETING A QUESTION
router.delete("/:name/delete-question", authenticateUser, async (req, res) => {
  const questionTitle = req.body.question;
  try {
    await Question.findOneAndDelete(
      { title: questionTitle },
      (error, response) => {
        if (error) {
          console.error(error);
        } else {
          res.json({ msg: `Question deleted ` });
        }
      }
    );
  } catch (error) {
    console.error(error);
  }
});

// EDITING QUESTIONS
router.put("/:name/edit-question", authenticateUser, async (req, res) => {
  const { oldQuestion, newQuestion } = req.body;
  try {
    let question = await Question.findOne({ title: oldQuestion });
    await Question.updateOne(
      question,
      { title: newQuestion },
      (err, response) => {
        err && console.error(err);
        res.json({ msg: "Done question modified" });
      }
    );
  } catch (error) {
    console.error(error);
  }
});

// ADDING ANSWERS
router.post("/:name/create-answer", async (req, res) => {
  const roomName = req.params.name;
  const { questionTitle, answers } = req.body;
  try {
    let room = await Room.findOne({ title: roomName }).lean();
    let roomID = room && room._id;
    let question = await Question.findOne({
      title: questionTitle,
      room: roomID,
    });
    let questionID = question && question._id;
    if (question) {
      for (let ans of answers) {
        await Answer.create({ value: ans, question: questionID });
      }
      res.json({ msg: "Answers added to question" });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
  }
});

// DELETE ANSWER
router.delete("/:name/delete-answer", authenticateUser, async (req, res) => {
  const roomName = req.params.name;
  const { questionTitle, answer } = req.body;
  try {
    let room = await Room.findOne({ title: roomName }).lean();
    let roomID = room && room._id;
    let question = await Question.findOne({
      title: questionTitle,
      room: roomID,
    });
    let questionID = question && question._id;
    if (question) {
      await Answer.findOneAndDelete(
        { value: answer, question: questionID },
        () => {
          res.json({ msg: "Answer deleted from question" });
        }
      );
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
  }
});

//VOTING FOR A SPECIFIC ANSWER ... SELECTING AN ANSWER

router.put("/:name/vote-for-answer",/* authenticateUser */  async (req, res) => {
  const roomName = req.params.name;
  const { questionTitle, answer } = req.body;
  try {
    let room = await Room.findOne({ title: roomName }).lean();
    let roomID = room && room._id;
    let question = await Question.findOne({
      title: questionTitle,
      room: roomID,
    });
    let questionID = question && question._id;
    if (question) {
      let ans = await Answer.findOne({ value: answer, question: questionID });
      if(!ans){
        return res.status(400).json({ msg: "No matching answer"})
      }
      let answerVote = ans && ans.vote;
      await Answer.updateOne(ans, { vote: answerVote + 1 }, () => {
        res.json({ msg: "Vote Added" });
      });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
  }
});


// REQUEST USER AUTH
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "You are not logged in" });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        console.error(error);
        return res.status(403).json({ msg: 'Not Authenticated'})
      }
      // req.user = user;
      next();
    });
  }
}

module.exports = router;
