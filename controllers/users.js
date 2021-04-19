const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, id } = req.body;
    const user = new User({ email, username, id });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (error) => {
      if (error) return next(error);
      req.flash("success", "Welcome to Cal Parks");
      res.redirect("/parks");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// technically passport does the logging in, this is more redirecting and rendering, but for all intents and purposes
// this is the login route.
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/parks";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("sucess", "Goodbye!");
  res.redirect("/parks");
};
