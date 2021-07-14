const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const amazonScraper = require("amazon-buddy");
const config = require("./config");
const participantInputModel = require("./participantInput");
const fs = require("fs");
const url = require("url");
const multer = require("multer");
// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");

mongoose
  .connect(process.env.NODE_ENV === 'production' ?process.env.database : config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DataBase connected successfully");
  })
  .catch((err) => {
    console.error(err);
  });
let db = mongoose.connection;

// Check for DB errors
db.on("error", function (err) {
  console.log(err);
});

//configuring hardDisk storage location for multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./tempImages");
  },
  filename: function (req, file, callback) {
    callback(null, "uploadedImage.jpg");
  },
});

//Initialize formData parsing middleware
var upload = multer({ storage });

// Creates a client
const client = new vision.ImageAnnotatorClient();

const productRetrieval = async (keyword, number) => {
  var products = [];
  const scrapperResult = await amazonScraper.products({
    keyword: keyword,
    number: number,
  });
  //console.log(scrapperResult);
  try {
    scrapperResult.result.forEach((item) => {
      products.push({
        id: item.asin,
        name: item.title,
        image: item.thumbnail,
        ratings: item.reviews.rating,
        price: item.price.current_price,
      });
    });

    return products;
  } catch (err) {
    console.log(err);
  }
};

// Init App
const app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

// Express Session Middleware
/* app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
); */

app.use(express.static(path.join(__dirname, "./build")));

app.use(cors());

app.post("/search", (req, res) => {
  const {
    body: { keyword, number },
  } = req;
  console.log(req.body);
  if (keyword !== "") {
    try {
      productRetrieval(keyword, 1).then((products) => {
        res.send(products);
      });
    } catch (err) {
      console.error(err);
    }
  } else res.send([]);
});

app.post("/submitSurvey", (req, res) => {
  const {
    body: {
      existingUser,
      textSearch,
      voiceSearch,
      imageSearch,
      surveyAnswers,
      assignedProduct,
    },
  } = req;
  const submitSurvey = (
    existingUser,
    textSearch,
    voiceSearch,
    imageSearch,
    surveyAnswers
  ) => {
    let participantInput = new participantInputModel({
      user: existingUser,
      textSearch,
      voiceSearch,
      imageSearch,
      surveyAnswers,
      assignedProduct,
    });

    /* participantInput.user = existingUser;
    participantInput.textSearch = textSearch;
    participantInput.voiceSearch = voiceSearch;
    participantInput.imageSearch = imageSearch;
    participantInput.surveyAnswers = surveyAnswers; */

    participantInput.save(function (err) {
      if (err) {
        console.error(err);
        res.end();
        return;
      } else {
        //console.log("Formdata added");
        console.log("Participant Data recorded !");
        res.send("success");
      }
    });
  };
  submitSurvey(
    existingUser,
    textSearch,
    voiceSearch,
    imageSearch,
    surveyAnswers
  );
});

app.post(
  "/ImageRecognition",
  upload.single("croppedImage"),
  async (req, res) => {
    // Performs label detection on the image file
    console.log(req.file.path);
    let request = {
      image: {
        content: fs.readFileSync(req.file.path),
      },
      features: [
        {
          type: "LABEL_DETECTION",
        },
        {
          type: "IMAGE_PROPERTIES",
        },
        {
          type: "WEB_DETECTION",
        },
        {
          type: "LOGO_DETECTION",
        },
        {
          type: "WEB_DETECTION",
        },
        {
          type: "IMAGE_PROPERTIES",
        },
      ],
    };
    const [result] = await client.annotateImage(request);
    const number = 1;
    var {
      labelAnnotations,
      logoAnnotations,
      textAnnotations,
      imagePropertiesAnnotation,
      webDetection,
    } = result;
    var log = {
      labelAnnotations,
      logoAnnotations,
      textAnnotations,
      imagePropertiesAnnotation,
      webDetection,
    };
    //console.log(result)
    console.log("image recog result", log);
    var keyword = labelAnnotations[0]
      ? labelAnnotations[0].description
      : "" + "" + logoAnnotations[0]
      ? logoAnnotations[0].description
      : "" + "" + textAnnotations[0]
      ? textAnnotations[0].description
      : "";
    try {
      productRetrieval(keyword, number).then((products) => {
        console.log("image recog result", log);
        res.send(products);
      });
    } catch (err) {
      console.error(err);
    }
  }
);

app.get("/getAssignedProduct", (req, res) => {
  let assignedProduct = [
    {
      category: "Automobile",
      productName: "BMW",
      productImage: "/car.jpg",
    },
    {
      category: "computers",
      productName: "Infinix",
      productImage: "/AndroidPhone.jpg",
    },
    {
      category: "Food and Grocery",
      productName: "boxed chocolate",
      productImage: "/chocolate.webp",
    },
    {
      category: "home & kitchen",
      productName: "LG fridge",
      productImage: "/fridge.jpg",
    },
    {
      category: "fashion",
      productName: "designer shirts",
      productImage: "/fashion.webp",
    },
  ];

  res.send(assignedProduct[Math.floor(Math.random() * 5)]);
});

app.get("/generateFakeData", (req, res) => {
  let assignedProduct = [
    {
      category: "Automobile",
      productName: "BMW",
      productImage: "/car.jpg",
    },
    {
      category: "computers",
      productName: "Infinix",
      productImage: "/AndroidPhone.jpg",
    },
    {
      category: "Food and Grocery",
      productName: "boxed chocolate",
      productImage: "/chocolate.webp",
    },
    {
      category: "home & kitchen",
      productName: "LG fridge",
      productImage: "/fridge.jpg",
    },
    {
      category: "fashion",
      productName: "designer shirts",
      productImage: "/fashion.webp",
    },
  ];

  let instructions = [
    {
      question: "How are you most likely to search for products ",
      options: ["Text", "Voice", "Image"],
    },
    {
      question: "Do you ever perform text searches on any devices ", // line graph for trend. may need to change this to input field
      options: ["never", "1-5 times a week", "6-10 times a week"],
    },
    {
      question: "Do you ever perform voice searches on any devices ",
      options: ["never", "1-5 times a week", "6-10 times a week"],
    },
    {
      question: "Do you ever perform image searches on any devices ",
      options: ["never", "1-5 times a week", "6-10 times a week"],
    },
    {
      question: "What device do you perform text searches on ", // use pie chart to represent this
      options: ["Mobile", "Laptop", "smart speaker"],
    },
    {
      question: "What device do you perform voice searches on ",
      options: ["Mobile", "Laptop", "smart speaker"],
    },
    {
      question: "What device do you perform image searches on ",
      options: ["Mobile", "Laptop", "smart speaker"],
    },
    {
      question: "How often does text search fail you ",
      options: ["never", "rearly", "sometimes", "all the times"],
    },
    {
      question: "How often does voice search misunderstand you ",
      options: ["never", "rearly", "sometimes", "all the times"],
    },
    {
      question: "How often does image search fail you ",
      options: ["never", "rearly", "sometimes", "all the times"],
    },
    {
      question: "How stressful is it to use text search ", // use bar charts for this
      options: ["very stressful", "stressful", "neutral", "pleasant to use"],
    },
    {
      question: "How stressful is it to use voice search ",
      options: ["very stressful", "stressful", "neutral", "pleasant to use"],
    },
    {
      question: "How stressful is it to use image search ",
      options: ["very stressful", "stressful", "neutral", "pleasant to use"],
    },
    {
      question: "which of these search methods do you look forward to using ",
      options: ["text", "image", "voice"],
    },
  ];

  let fakeData = {};
  const random = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < 100; i++) {
    let searchedProduct = assignedProduct[Math.floor(Math.random() * 5)];

    fakeData = {
      user: i.toString(),
      textSearch: {
        searchTime: random(0, 0.001).toString(),
        productFound: true,
        timeToPurchase: random(0, 5),
        accuracyCount: (() => {
          let i = random(1, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })(),
      },
      voiceSearch: {
        searchTime: random(0, 0.01).toString(),
        productFound: true,
        timeToPurchase: random(1, 5),
        accuracyCount: (() => {
          let i = random(1, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })(),
      },
      imageSearch: {
        searchTime: random(0, 0.1).toString(),
        productFound: true,
        timeToPurchase: random(1.5, 5),
        accuracyCount: (() => {
          let i = random(1, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })(),
      },
      surveyAnswers: (() => {
        let QA = [];
        instructions.forEach((inst, index) => {
          let obj = {};
          obj.question = inst.question;
          obj.answer =
            inst.options[Math.floor(Math.random() * inst.options.length)];
         /*  if (index === 0)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 1)];
          */ if (index === 1) obj.answer = inst.options[Math.floor(random(1, 2))];
          if (index === 4)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 2)];
          if (index === 6)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 2)];
          if (index === 7)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 2)];
          if (index === 8)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 2)];
          if (index === 9)
            obj.answer =
              inst.options[Math.floor(Math.random() * inst.options.length - 2)];
          if (index === 10) obj.answer = inst.options[Math.floor(random(2, 3))];
          if (index === 11) obj.answer = inst.options[Math.floor(random(1, 3))];
          if (index === 13) obj.answer = inst.options[Math.floor(random(1, 2))];
          QA.push(obj);
        });
        return QA;
      })(),
      assignedProduct: searchedProduct,
    };

    switch (searchedProduct.category) {
      case "fashion":
        fakeData.textSearch.accuracyCount = (() => {
          let i = random(1, 10);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.imageSearch.accuracyCount = (() => {
          let i = random(10, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.voiceSearch.accuracyCount = (() => {
          let i = random(1, 10);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();

        //
        fakeData.textSearch.timeToPurchase = random(3, 7);
        fakeData.voiceSearch.accuracyCount = random(3.5, 7);

        break;
      case "Food and Grocery":
        fakeData.textSearch.accuracyCount = (() => {
          let i = random(1, 10);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.imageSearch.accuracyCount = (() => {
          let i = random(10, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.voiceSearch.accuracyCount = (() => {
          let i = random(1, 10);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();

        //
        fakeData.textSearch.timeToPurchase = random(3, 7);
        fakeData.voiceSearch.accuracyCount = random(3.5, 7);
        break;
      case "home & kitchen":
        fakeData.textSearch.accuracyCount = (() => {
          let i = random(6, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.imageSearch.accuracyCount = (() => {
          let i = random(1, 10);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();
        fakeData.voiceSearch.accuracyCount = (() => {
          let i = random(7, 21);
          let arr = [];
          for (let t = 0; t < i; t++) {
            arr.push({});
          }
          return arr;
        })();

        //
        fakeData.textSearch.timeToPurchase = random(3, 7);
        fakeData.imageSearch.accuracyCount = random(3.5, 7);
        break;

      default:
        break;
    }

    let participantInput = new participantInputModel(fakeData);

    participantInput.save(function (err) {
      if (err) {
        console.error(err);
        res.end();
        return;
      } else {
        //console.log("Formdata added");
        console.log("Participant Data recorded !");
      }
    });


  }

  res.send("success");
  var surveySubmitSample = [
    {
      question: "How are you most likely to search for products ",
      answer: "Text",
    },
    {
      question: "Do you ever perform text searches on any devices ",
      answer: "never",
    },
    {
      question: "Do you ever perform voice searches on any devices ",
      answer: "never",
    },
    {
      question: "Do you ever perform image searches on any devices ",
      answer: "never",
    },
    {
      question: "What device do you perform text searches on ",
      answer: "Mobile",
    },
    {
      question: "What device do you perform voice searches on ",
      answer: "Mobile",
    },
    {
      question: "What device do you perform image searches on ",
      answer: "Mobile",
    },
    {
      question: "How often does text search fail you ",
      answer: "never",
    },
    {
      question: "How often does voice search misunderstand you ",
      answer: "never",
    },
    {
      question: "How often does image search fail you ",
      answer: "never",
    },
    {
      question: "How stressful is it to use text search ",
      answer: "very stressful",
    },
    {
      question: "How stressful is it to use voice search ",
      answer: "very stressful",
    },
    {
      question: "How stressful is it to use image search ",
      answer: "very stressful",
    },
    {
      question: "witch of these search methods do you look forward to using ",
      answer: "text",
    },
  ];
});

app.get("/allData", (req, res) => {
  participantInputModel.find({}, (err,docs) => {
    console.log('docs found')
    res.send(docs);
  });
});
app.use(express.static("assets"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("server started on port", port);
});

