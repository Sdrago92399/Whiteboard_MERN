const Whiteboard = require("../models/Board");

// Create a new whiteboard
exports.newBoard = async (req, res) => {
  const { name } = req.body;
  try {
    const newWhiteboard = new Whiteboard({ boardTitle: name });
    await newWhiteboard.save();
    res.status(201).json(newWhiteboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating whiteboard." });
  }
};

// Get all whiteboards the user has access to
exports.getBoards = async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find({ boardElements: null });
    res.status(200).json(whiteboards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching whiteboards." });
  }
};

// Add a user to a whiteboard
exports.addUser = async (req, res) => {
  const whiteboardId = req.params.id;
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const whiteboard = await Whiteboard.findByIdAndUpdate(
      whiteboardId,
      { $addToSet: { users: user._id } },
      { new: true }
    );

    res.status(200).json(whiteboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding user to whiteboard." });
  }
};

