const User = require("../Schema/User");
const { hashPassword, comparePassword, createJWT } = require("../Module/auth");

 const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (allUsers.length === 0) {
      return res.json({ data: "No User Found", status: "failed" });
    }

    res.json({ data: allUsers, status: "success" });
  } catch (error) {
    res.json({ message: "Error", error });
  }
};

 const getOneUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ data: user, status: "success" });
};

 const createUser = async (req, res) => {
  try {
    if (await User.findOne({ username: req.body.username })) {
      return res.json({ data: "User Already Exists", status: "failed" });
    }

    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: await hashPassword(req.body.password),
    });

    const token = createJWT(newUser);
    res.json({ token, status: "success", cid: newUser._id });
  } catch (error) {
    res.json({ error });
  }
};

 const updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,        
      // password: await hashPassword(req.body.password),
    },
    { new: true }
  );
  res.json({ data: updatedUser, status: "success" });
};

 const deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);

  if (!deletedUser) {
    return res.json({ data: "User not found", status: "failed" });
  }

  res.json({ data: deletedUser, status: "success" });
};

 const signIn = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user) {    
      if (await comparePassword(req.body.password, user.password)) {       
        const token = createJWT(user);
        res.json({ token, status: "success", cid: user._id });
      } else {
        res.json({ data: "Invalid Credentials", status: "failed" });
      }
    } else {
      res.json({ data: "Invalid Username", status: "failed" });
    }
  } catch (error) {
    res.json({ error, status: "failed" , path: "signin"});
  }
};

module.exports = { getAllUser, getOneUser, createUser, updateUser, deleteUser, signIn };     