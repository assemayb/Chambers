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
    // Delete un-needed data
    for (let room of allRooms) {
      delete room._id;
      delete room.admin._id;
      delete room.admin.password;
    }
    res.status(200).json(allRooms);
  } catch (error) {
    console.error(error);
  }
});

// Get User Question
router.get("/user-questions", authenticateUser, async (req, res) => {
  const adminName = req.user.username;
  let allUserQuestions = [];
  try {
    const admin = await User.findOne({ name: adminName });
    const adminID = admin && admin._id;
    const adminRooms = await Room.find({ admin: adminID }, (err, resp) => {
      err && console.error(err);
    });
    for (let room of adminRooms) {
      const roomID = room._id;
      const questions = await Question.find({ room: roomID }).lean();
      // questions.forEach(q => {
      //   allUserQuestions.push(q.title)
      // })
      allUserQuestions.push(...questions);
    }
    res.status(201).json(allUserQuestions);
  } catch (err) {
    console.error(err);
  }
});
// Get a certain user rooms
router.get("/user-rooms", authenticateUser, async (req, res) => {
  const adminName = req.user.username;
  try {
    const admin = await User.findOne({ name: adminName });
    const adminID = admin && admin._id;

    if (adminID) {
      const allUserRooms = await Room.find({ admin: adminID });
      let allUserRoomsName = [];
      allUserRooms.forEach((room) => {
        allUserRoomsName.push({
          title: room.title,
          createdAt: room.createdAt,
          parts: room.participants,
        });
      });
      const adminRoomsAsUser = admin.rooms;
      res.status(200).json([allUserRoomsName, adminRoomsAsUser]);
    } else {
      console.log("No admin with this id");
    }
  } catch (err) {
    console.error(err);
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
      res.json(relatedQuestions).status(200);
      // console.log(JSON.stringify(relatedQuestions, null, 5))
    }
  } catch (error) {
    console.error(error);
  }
});

// CREATING A ROOM
router.post("/create", authenticateUser, async (req, res) => {
  const title = req.body.title;
  const username = req.user.username;
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
        let userRooms = user.rooms;
        let userRoomsArrLength = userRooms && userRooms.length;
        if (userRooms === undefined || userRoomsArrLength < 1) {
          await User.updateOne({ name: username }, { $push: { rooms: title } });
          console.log("Room is added to the user's");
        } else {
          let isFound = false;
          for (userRoom of userRooms) {
            if (userRoom === title) {
              isFound = true;
            }
          }
          !isFound
            ? await User.updateOne(
                { name: username },
                { $push: { rooms: title } }
              )
            : console.log("Room is already in this user's rooms");
        }
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
  const roomName = req.params.name;
  const reqUserName = req.user.username;
  try {
    const room = await Room.findOne({ title: roomName })
      .populate("admin")
      .lean();
    const roomID = room._id;
    if (!room) return res.json({ msg: "No room" });
    const roomAdminName = room.admin.name;
    if (reqUserName === roomAdminName) {
      let allRoomQuestions = await Question.find({ room: roomID }).lean();
      for (let question of allRoomQuestions) {
        let questionID = question._id;
        await Answer.deleteMany({ question: questionID });
      }
      await Question.deleteMany({ room: roomID });
      await Room.deleteOne(room);
      await User.updateOne(
        { name: reqUserName },
        { $pull: { rooms: roomName } }
      );
      res.json({ msg: "deleted" });
    }
  } catch (error) {
    console.error(error);
  }
});

// CREATING QUESTIONS
router.post("/:name/create-question", authenticateUser, async (req, res) => {
  const roomName = req.params.name;
  const questionTitle = req.body.question;
  const answers = req.body.answers;
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
      let question = await Question.create({
        title: questionTitle,
        room: roomID,
      });
      const questionID = question._id;
      if (questionID) {
        for (let ans of answers) {
          await Answer.create(
            { value: ans, question: questionID },
            (err, response) => {
              if (err) {
                console.error(err);
              }
            }
          );
        }

        res.json({ msg: "question created with Answers" });
      }
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
router.put("/:name/vote-for-answer", authenticateUser, async (req, res) => {
  const roomName = req.params.name;
  const username = req.user.username;
  const { questionTitle, answer } = req.body;

  try {
    const user = await User.findOne({ name: username });
    const userRooms = user.rooms;

    const room = await Room.findOne({ title: roomName });
    const roomParticipants = room.participants;

    const roomPartLength = roomParticipants && roomParticipants.length;
    if (roomPartLength == 0) {
      await Room.updateOne(
        { title: roomName },
        { $push: { participants: username } }
      );
      if (userRooms.length == 0) {
        await User.updateOne(
          { name: username },
          { $push: { rooms: roomName } }
        );
      }
    } else {
      let isUserInPart = false;
      let isRoomInUserRooms = false;

      for (let part of roomParticipants) {
        if (part === username) {
          isUserInPart = true;
        }
      }
      if (!isUserInPart) {
        await Room.updateOne(
          { title: roomName },
          { $push: { participants: username } }
        );
      }
      if (userRooms.length >= 1) {
        for (let room of userRooms) {
          if (room === roomName) {
            isRoomInUserRooms = true;
          }
        }
        if (!isRoomInUserRooms) {
          await User.updateOne(
            { name: username },
            { $push: { rooms: roomName } }
          );
        }
      } else {
        await User.updateOne(
          { name: username },
          { $push: { rooms: roomName } }
        );
      }
    }
    let roomID = room && room._id;
    let question = await Question.findOne({
      title: questionTitle,
      room: roomID,
    });
    let questionID = question && question._id;
    if (question) {
      let ans = await Answer.findOne({ value: answer, question: questionID });
      if (!ans) {
        return res.status(400).json({ msg: "No matching answer" });
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
      console.log("Authenticating the user ");
      console.log(user);

      if (error) {
        console.error(error);
        // res.status(403).json({ msg: "Not Authenticated" });
        // return res.status(403).json(error);
      }
      console.log(user)
      req.user = user;
      next();
    });
  }
}

module.exports = router;
