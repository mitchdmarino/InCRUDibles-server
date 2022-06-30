const router = require("express").Router();
const db = require("../../models");
const authLockedRoute = require("./authLockedRoute");

router.post("/", authLockedRoute, async (req, res) => {
  try {
    // The account that is signed is searched for.
    const account = res.locals.account;
    // A new task is created based on the req.body.
    const newTask = await db.Task.create(req.body);
    // A new task is added to the account.
    account.tasks.push(newTask);
    // The task is saved.
    await account.save();
    await newTask.save();
    const response = await account.populate({path: 'tasks', populate: {path: 'profile'}});
    res.json(response);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ msg: "server error" });
  }
});

router.post(
  "/:taskId/profile/:profileId",
  authLockedRoute,
  async (req, res) => {
    try {
      const profile = await db.Profile.findById(req.params.profileId);
      const task = await db.Task.findById(req.params.taskId);

      task.profile = profile;
      await task.save();
      console.log(task.profile, "here??");
      res.json(task);
    } catch (error) {}
  }
);

router.get("/", authLockedRoute, async (req, res) => {
  try {
    const account = res.locals.account;
    const tasks = await db.Task.find({
      account: account._id,
    }).populate("profile");
    res.json(tasks);
  } catch (err) {
    console.warn(err);
  }
});

// Update a task.
router.put("/:id", authLockedRoute ,async (req, res) => {
  try {
    const id = req.params.id;
    const options = { new: true };
    // The task is searched for.
    const task = await db.Task.findByIdAndUpdate(id, req.body, options);
    res.json(task);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ msg: "server error" });
  }
});

// Delete a task.
router.delete("/:id", authLockedRoute ,async (req, res) => {
  try {
    const id = req.params.id;
    await db.Task.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
