const fs = require("fs");
// const http ga usah karena pakai express
const express = require("express");

const app = express();

// middleware untuk membaca json dari request body(client, FE dll) ke kita
app.use(express.json());

// default URL = Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running...",
  });
});

// req.url === /
app.get("/tegar", (req, res) => {
  res.status(200).json({
    message: "Ping Successfully !",
  });
});

const cars = JSON.parse(fs.readFileSync(`${__dirname}/assets/data/cars.json`));

// /api/v1/(collection nya) => collection nya harus JAMAK (s)
app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Success get cars data !",
    isSuccess: true,
    total: cars.length,
    data: {
      cars,
    },
  });
});

// respon.data.cars

app.post("/api/v1/cars", (req, res) => {
  //insert into

  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/assets/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "Success add new car data !",
        isSuccess: true,
        data: {
          car: newCar,
        },
      });
    }
  );
});

// get by id
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 where id = "1" OR Name = "Yogi"
  const id = req.params.id;

  console.log(req.params);
  console.log(id);

  // == maka tidak peduli tipe datanya apa, kalau sama "10" == 10 (TRUE), karena tidak cek tipe data
  // === jika 10 === "10" (FALSE), karena tipe data berbeda

  const car = cars.find((i) => i.id === id);

  // salah satu basic error handling
  if (!car) {
    console.log("gak ada data");
    // return agar berhenti membaca respon bawahnya
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this : ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Success get car data !",
    isSuccess: true,
    data: {
      car,
    },
  });
});

// middleware / handler untuk url yang tidak dapat diakses karena memang tidak ada di apklikasi
// membuat middleware = our own middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "API not exist !!!",
  });
});

app.listen("3000", () => {
  console.log("start aplikasi di port 3000");
});
