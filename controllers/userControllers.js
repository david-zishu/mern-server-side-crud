const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");
const User = require("../models/user");
const BASE_URL = process.env.BASE_URL;

async function handleUserRegister(req, res) {
  const file = req.file.filename;
  const { fname, lname, email, mobile, gender, location, status } = req.body;

  if (
    !fname ||
    !lname ||
    !email ||
    !mobile ||
    !gender ||
    !location ||
    !status ||
    !file
  ) {
    res.status(401).json({ msg: "All fields is required" });
  }
  try {
    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(401).json({ msg: "User is already exist in our database" });
    } else {
      const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
      const userData = new User({
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
        dateCreated,
      });
      await userData.save();
      res.status(200).json({ msg: "user created successfully", userData });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: err });
  }
}

async function handleGetAllUsers(req, res) {
  const search = req.query.search || "";
  const gender = req.query.gender || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 4;

  const query = {
    fname: { $regex: search, $options: "i" },
  };

  if (gender !== "All") {
    query.gender = gender;
  }
  if (status !== "All") {
    query.status = status;
  }

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;
    const count = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({
        dateCreated: sort === "new" ? -1 : 1,
      })
      .limit(ITEM_PER_PAGE)
      .skip(skip);
    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      pagination: {
        count,
        pageCount,
      },
      users,
    });
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

async function handleGetUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json(user);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

async function handleUpdateUser(req, res) {
  const {
    fname,
    lname,
    email,
    mobile,
    gender,
    location,
    status,
    user_profile,
  } = req.body;
  const file = req.file ? req.file.filename : user_profile;
  const deteUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        fname,
        lname,
        email,
        mobile,
        gender,
        location,
        status,
        profile: file,
        deteUpdated,
      },
      {
        new: true,
      }
    );
    await updateUser.save();
    res.status(201).json(updateUser);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

async function handleDeleteUser(req, res) {
  try {
    const deleteUser = await User.findByIdAndDelete({ _id: req.params.id });
    res.status(201).json(deleteUser);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

async function handleUserStatus(req, res) {
  const { data } = req.body;

  try {
    const userStatusUpdate = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        status: data,
      },
      { new: true }
    );
    res.status(201).json(userStatusUpdate);
  } catch (err) {
    res.status(401).json({ error: err });
  }
}

async function handleExportCsv(req, res) {
  try {
    const usersdata = await User.find();
    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export/")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }
      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export/");
      }
    }

    const writablestream = fs.createWriteStream(
      "public/files/export/users.csv"
    );

    csvStream.pipe(writablestream);

    writablestream.on("finish", function () {
      res.json({
        downloadUrl: `${BASE_URL}/files/export/users.csv`,
      });
    });
    if (usersdata.length > 0) {
      usersdata.map((user) => {
        csvStream.write({
          FirstName: user.fname ? user.fname : "-",
          LastName: user.lname ? user.lname : "-",
          Email: user.email ? user.email : "-",
          Phone: user.mobile ? user.mobile : "-",
          Gender: user.gender ? user.gender : "-",
          Status: user.status ? user.status : "-",
          Profile: user.profile ? user.profile : "-",
          Location: user.location ? user.location : "-",
          DateCreatedAt: user.dateCreated ? user.dateCreated : "-",
        });
      });
    }
    csvStream.end();
    writablestream.end();
  } catch (error) {
    res.status(401).json(error);
  }
}

module.exports = {
  handleUserRegister,
  handleGetAllUsers,
  handleGetUser,
  handleUpdateUser,
  handleDeleteUser,
  handleUserStatus,
  handleExportCsv,
};
