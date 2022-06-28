const router = require("express").Router();
const db = require("../../models");
const authLockedRoute = require("./authLockedRoute");

router.post("/", authLockedRoute, async (req, res) => {
  try {
    // find the account that is signed in
    const account = res.locals.account;
    // create a new task based on the req.body
    const newTask = await db.Task.create(req.body);
    // add the newtask to the account
    account.tasks.push(newTask);
    // save
    await account.save();
    await newTask.save();
    const response = await account.populate("tasks");
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
    console.log(tasks, "asdf");
  } catch (err) {
    console.warn(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const options = { new: true };
    // find the task
    const task = await db.Task.findByIdAndUpdate(id, req.body, options);
    res.json(task);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ msg: "server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.Task.findByIdAndDelete(id);
    // no content status
    res.sendStatus(204);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
