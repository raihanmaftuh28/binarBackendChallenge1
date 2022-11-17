const express = require("express");
const app = express();
const { Car } = require("./models");
const cloudinary = require("./cloudHandler/cloudinary");
const upload = require("./cloudHandler/fileUpload");

app.use(express.json());

const getCarData = (req, res) => {
  Car.findAll().then((car) => {
    res.json(car);
  });
};

const postCarData = (req, res) => {
  const { name, price, size } = req.body;
  console.log("price", price);

  if (!name || !price || !size) {
    res.status(400).send("Failed inserting new data to database");
    return;
  }

  const ayam = req.file;
  console.log("a");
  const fileBase64 = ayam.buffer.toString("base64");
  const file = `data:${ayam.mimetype};base64,${fileBase64}`;
  cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      res.status(400).send(`Failed to Upload image: ${err.message}`);
      return;
    }
    Car.create({
      name,
      price,
      size,
      image: result.url,
    })
      .then((car) => {
        res.status(201).json(car);
      })
      .catch((err) => {
        res.status(422).json("failed to insert new entry");
      });
  });
};

const getCarById = (req, res) => {
  const { id } = req.params;
  Car.findOne({
    where: { id },
  }).then((car) => {
    if (!car) {
      res.status(404).json("Entry not found!");
    } else {
      res.json(car);
    }
  });
};

const updateCarById = (req, res) => {
  const { id } = req.params;
  const { name, price, size } = req.body;
  console.log(req.body);
  if (!name || !price || !size) {
    res.status(404).send("Name, Status, and Email should not be empty");
    return;
  }
  Car.update(
    {
      name,
      price,
      size,
    },
    { where: { id } }
  ).then((car) => {
    if (car == 0) {
      res.status(404).json("Entry doesn't exist!");
      return;
    }
    res.status(201).json("success updating with entry!");
  });
};

const deleteCarById = (req, res) => {
  const { id } = req.params;
  Car.destroy({
    where: { id },
  }).then((car) => {
    if (car == 0) {
      res.status(404).json("Entry doesn't exist!");
    } else {
      res.json("Success deleting data from database");
    }
  });
};

app.get("/api/cars", getCarData);
app.post("/api/cars", upload.single("picture"), postCarData);
app.put("/api/car/:id", updateCarById);
app.get("/api/car/:id", getCarById);
app.delete("/api/cars/:id", deleteCarById);

app.listen(1000, () => {
  console.log("server is running on http://localhost:1000");
});
