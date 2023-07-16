const User = require("../models/User");
const AUTH_SECRET_KEY = "CYONLAGOSAYD2023";

exports.getUser = (req, res, next) => {
  console.log("USer method")
  User.findAll()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.json({ msg: "failed", error: err }));
};

exports.createUser = (req, res, next) => {
  console.log(req.body, "see");
  const { FirstName, LastName, Email, Password, PhoneNumber, DeaneryId } =
    req?.body;
  if (
    !FirstName ||
    !LastName ||
    !Email ||
    !Password ||
    !PhoneNumber ||
    !DeaneryId
  ) {
    res.status(400).json({ msg: "All Fields are required" });
  } else {
    User.findOne({
      where: {
        Email,
      },
    })

      .then((emailExist) => {
        if (emailExist) {
          res.status(400).json({ msg: "Email already exist" });
        } else {
          let hashedPassword;
          try {
            const salt = bcrypt.genSaltSync(10);
            hashedPassword = bcrypt.hashSync(password, salt);
          } catch (error) {
            throw error;
          }
          User.create({
            FirstName,
            Email,
            LastName,
            PhoneNumber,
            Password: hashedPassword,
            DeaneryId,
          })
            .then((user) => {
              jwt.sign(
                { id: user.id },
                AUTH_SECRET_KEY,
                { expiresIn: "5h" },
                (err, token) => {
                  return res.status(200).json({
                    token,
                    user,
                  });
                }
              );
            })
            .catch((err) => res.json({ msg: err.message || "Not created" }));
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }
};
