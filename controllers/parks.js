const Park = require("../models/park");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("parks/new");
};

module.exports.createNewPark = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.park.location,
      limit: 1,
    })
    .send();
  const park = new Park(req.body.park);
  park.geometry = geoData.body.features[0].geometry;
  park.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  park.author = req.user._id;
  await park.save();
  req.flash("success", "Successfully made a new park!");
  res.redirect(`/parks/${park._id}`);
};

module.exports.showPark = async (req, res, next) => {
  //nested populate on park for reviews, within reviews populating the author of each review.
  //using an object to populate reviews within park, within that object populate author for that review
  const park = await Park.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  //error handling if user requests a deleted campground
  if (!park) {
    req.flash("error", "Park not found");
    return res.redirect("/parks");
  }
  res.render("parks/show", { park });
};

module.exports.renderEditParkForm = async (req, res, next) => {
  const { id } = req.params;
  const park = await Park.findById(id);
  if (!park) {
    req.flash("error", "Park not found");
    return res.redirect("/parks");
  }
  return res.render("parks/edit", { park });
};

module.exports.editPark = async (req, res, next) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  park.images.push(...images);
  await park.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await park.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated a park!");
  res.redirect(`/parks/${park._id}`);
};

module.exports.deletePark = async (req, res, next) => {
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a park.");
  res.redirect("/parks");
};
