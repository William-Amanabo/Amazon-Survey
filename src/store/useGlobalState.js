import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "../components/Modal";

function useGlobalState() {
  const history = useHistory();
  const location = useLocation();
  let [completedSurvey, setCompletedSurvey] = useState();
  let [existingUser, setExistingUser] = useState("");
  let [assignedProduct, setAssignedProduct] = useState({});
  let [searchType, setSearchType] = useState("not-assigned");
  let [buyingProduct, setBuyingProduct] = useState(true);
  let [textSearch, setTextSearch] = useState({
    searchTime: "",
    productFound: "",
    timeToPurchase: "",
    accuracyCount: [],
    surveyQA: {},
  });
  let [voiceSearch, setVoiceSearch] = useState({
    searchTime: "",
    productFound: "",
    timeToPurchase: "",
    accuracyCount: [],
    surveyQA: {},
  });
  let [imageSearch, setImageSearch] = useState({
    searchTime: "",
    productFound: "",
    timeToPurchase: "",
    accuracyCount: [],
    surveyQA: {},
  });
  let [surveyAnswers, setSurveyAnswers] = useState([]);

  useEffect(() => {
    //TOD check to see if user has completed or has started the survey, automatically redirect to continue
    console.log("useGlobalState useEffect fired");
    if (window.localStorage.getItem("completedSurvey")) {
      history.push("/result");
    } else {
      if (window.localStorage.getItem("existingUser") === null) {
        if (location.pathname !== "/") {
          history.push("/"); // this code will probably break stuff
        }
      } else {
        if (window.localStorage.getItem("buyingProduct")) {
          setBuyingProduct(window.localStorage.getItem("buyingProduct"));
        }

        if (window.localStorage.getItem("assignedProduct")) {
          setAssignedProduct(
            JSON.parse(window.localStorage.getItem("assignedProduct"))
          );
        }

        if (window.localStorage.getItem("textSearch")) {
          setTextSearch(JSON.parse(window.localStorage.getItem("textSearch")));
        }
        if (window.localStorage.getItem("voiceSearch")) {
          setVoiceSearch(
            JSON.parse(window.localStorage.getItem("voiceSearch"))
          );
        }
        if (window.localStorage.getItem("imageSearch")) {
          setImageSearch(
            JSON.parse(window.localStorage.getItem("imageSearch"))
          );
        }
        if (window.localStorage.getItem("searchType")) {
          setSearchType(window.localStorage.getItem("searchType"));
          if (window.localStorage.getItem("searchType") === "survey") {
            history.push("/survey");
          } else {
            history.push("/search");
          }
        }
      }
    }
  }, []);

  let searchTime = async (type, action) => {
    console.log("action", action);
    const startTime = Date.now();
    let elapsedTime;
    if (action.constructor.name === "AsyncFunction") {
      await action().then((elapsedTime = (Date.now() - startTime) / 1000));
    } else {
      await action();
      elapsedTime = (Date.now() - startTime) / 1000;
    }

    console.log("elapsed time", elapsedTime);
    switch (type) {
      case "text":
        setTextSearch({ ...textSearch, searchTime: elapsedTime });
        break;
      case "voice":
        setVoiceSearch({ ...voiceSearch, searchTime: elapsedTime });
        break;
      case "image":
        setImageSearch({ ...imageSearch, searchTime: elapsedTime });
        break;

      default:
        Error();
        break;
    }
    return;
  };

  let purchaseTime = (action, type) => {
    var startTime = 0;

    if (action === "start") {
      startTime = Date.now();
    } else if (action === "stop") {
      const elapsedTime = (Date.now() - startTime) / 1000;
      switch (type) {
        case "text":
          setTextSearch({
            ...textSearch,
            timeToPurchase: elapsedTime,
            productFound: true,
          });
          window.localStorage.setItem("textSearch", JSON.stringify(textSearch));
          break;
        case "voice":
          setVoiceSearch({
            ...voiceSearch,
            timeToPurchase: elapsedTime,
            productFound: true,
          });
          window.localStorage.setItem(
            "voiceSearch",
            JSON.stringify(voiceSearch)
          );
          break;
        case "image":
          setImageSearch({
            ...imageSearch,
            timeToPurchase: elapsedTime,
            productFound: true,
          });
          window.localStorage.setItem(
            "imageSearch",
            JSON.stringify(imageSearch)
          );
          break;

        default:
          Error();
          break;
      }
      return;
    }
  };

  let addToAccuracyCount = (type, id) => {
    switch (type) {
      case "text":
        if (!textSearch.accuracyCount.includes(id)) {
          setTextSearch({
            ...textSearch,
            accuracyCount: [...textSearch.accuracyCount, id],
          });
        } else {
          setTextSearch({
            ...textSearch,
            accuracyCount: textSearch.accuracyCount.filter(
              (items) => items !== id
            ),
          });
        }
        window.localStorage.setItem("textSearch", JSON.stringify(textSearch));
        break;
      case "voice":
        if (!voiceSearch.accuracyCount.includes(id)) {
          setVoiceSearch({
            ...voiceSearch,
            accuracyCount: [...voiceSearch.accuracyCount, id],
          });
        } else {
          setVoiceSearch({
            ...voiceSearch,
            accuracyCount: voiceSearch.accuracyCount.filter(
              (items) => items !== id
            ),
          });
        }
        window.localStorage.setItem("voiceSearch", JSON.stringify(voiceSearch));
        break;
      case "image":
        if (!imageSearch.accuracyCount.includes(id)) {
          setImageSearch({
            ...imageSearch,
            accuracyCount: [...imageSearch.accuracyCount, id],
          });
        } else {
          setImageSearch({
            ...imageSearch,
            accuracyCount: imageSearch.accuracyCount.filter(
              (items) => items !== id
            ),
          });
        }
        window.localStorage.setItem("imageSearch", JSON.stringify(imageSearch));
        break;

      default:
        break;
    }
  };

  function handleNotFound(type) {
    switch (type) {
      case "text":
        setTextSearch({
          searchTime: 0,
          productFound: false,
          timeToPurchase: 0,
          accuracyCount: [],
          surveyQA: {},
        });
        break;
      case "voice":
        setVoiceSearch({
          searchTime: 0,
          productFound: false,
          timeToPurchase: 0,
          accuracyCount: [],
          surveyQA: {},
        });
        break;
      case "image":
        setImageSearch({
          searchTime: 0,
          productFound: false,
          timeToPurchase: 0,
          accuracyCount: [],
          surveyQA: {},
        });
        break;

      default:
        Error();
        break;
    }
    return;
  }

  /* const submitSurvey = () => {
    //TOD: create a MongoDB request to save user survey data
    mongoose
      .connect(config.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        console.log("DataBase connected successfully");
      })
      .catch((err) => {
        console.log.error(err);
      });
    let db = mongoose.connection;

    // Check connection
    db.once("open", function () {
      console.log("Connected to MongoDB");
    });

    // Check for DB errors
    db.on("error", function (err) {
      console.log(err);
    });

    let participantInputSchema = mongoose.Schema({
      user: {
        type: String,
        required: true,
      },
      textSearch: {
        searchTime: {
          type: Number,
          required: true,
        },
        productFound: {
          type: Boolean,
          required: true,
        },
        timeToPurchase: {
          type: Number,
          required: true,
        },
        accuracyCount: {
          type: Array,
          required: true,
        },
        surveyQA: {
          type: Object,
          required: true,
        },
      },
      voiceSearch: {
        searchTime: {
          type: Number,
          required: true,
        },
        productFound: {
          type: Boolean,
          required: true,
        },
        timeToPurchase: {
          type: Number,
          required: true,
        },
        accuracyCount: {
          type: Array,
          required: true,
        },
        surveyQA: {
          type: Object,
          required: true,
        },
      },
      imageSearch: {
        searchTime: {
          type: Number,
          required: true,
        },
        productFound: {
          type: Boolean,
          required: true,
        },
        timeToPurchase: {
          type: Number,
          required: true,
        },
        accuracyCount: {
          type: Array,
          required: true,
        },
        surveyQA: {
          type: Object,
          required: true,
        },
      },
    });

    let participantInput = mongoose.model(
      "participantInput",
      participantInputSchema
    );

    participantInput.user = existingUser;
    participantInput.textSearch = textSearch;
    participantInput.voiceSearch = voiceSearch;
    participantInput.imageSearch = imageSearch;
    participantInput.surveyAnswers = surveyAnswers

    participantInput.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        //console.log("Formdata added");
        console.log("Participant Data recorded !");
        setCompletedSurvey(true);
        history.push("/thankyou");
      }
    });
  }; */

  const submitSurvey = () => {
    console.log({
      existingUser,
      textSearch,
      voiceSearch,
      imageSearch,
      surveyAnswers,
      assignedProduct,
    });
    axios
      .post("/submitSurvey", {
        existingUser,
        textSearch,
        voiceSearch,
        imageSearch,
        surveyAnswers,
        assignedProduct,
      })
      .then((res) => {
        console.log(res);
        window.localStorage.setItem("completedSurvey", true);
        setCompletedSurvey(true);
        history.push("/results");
      });
  };
  const createUser = (user) => {
    window.localStorage.setItem("existingUser", user);
    handleSearchTypeChange();
    setExistingUser(user);
  };
  const handleSearchTypeChange = (type) => {
    console.log("handleSearchTypeChange runs");
    console.log("searchType before login", searchType);
    switch (searchType) {
      case "not-assigned":
        window.localStorage.setItem("searchType", "text");
        setSearchType("text");
        break;
      case "text":
        window.localStorage.setItem("searchType", "voice");
        setSearchType("voice");
        break;
      case "voice":
        window.localStorage.setItem("searchType", "image");
        setSearchType("image");
        break;
      case "image":
        window.localStorage.setItem("searchType", "survey");
        setSearchType("survey");
        history.push("/survey");
        break;

      default:
        Error();
        break;
    }
    console.log("searchType after login", searchType);

    //window.localStorage.setItem("searchType", searchType);
    window.localStorage.setItem("buyingProduct", buyingProduct);
    setBuyingProduct(true);
  };

  const displayModal = Modal.show;

  const getSavedData = (searchType) => {
    switch (searchType) {
      case "text":
        return textSearch;
        break;
      case "voice":
        return voiceSearch;
        break;
      case "image":
        return imageSearch;
        break;
      case "user":
        return existingUser;
        break;
      case "assignedProduct":
        return assignedProduct;
        break;
      default:
        Error();
        break;
    }
  };

  return {
    setCompletedSurvey,
    setAssignedProduct,
    assignedProduct,
    setBuyingProduct,
    setSurveyAnswers,
    searchTime,
    purchaseTime,
    addToAccuracyCount,
    submitSurvey,
    createUser,
    displayModal,
    handleSearchTypeChange,
    getSavedData,
    handleNotFound,
    buyingProduct,
    searchType,
  };
}

export default useGlobalState;
