import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import useStore from "../store/useStore";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
import Header from "./Header";
import instructions from "./instructions";


const StyledResult = styled.div`
  width: 95%;
  align-self: center;
  margin: auto;
  padding: 20px;
  margin-top: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 100%;
    max-width: 900px;
    border-radius: 20px;
    // background-color: #100e17;
    background-color: #fff;
    display: flex;
    justify-content: left;
    align-items: center;
    flex-direction: column;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
  }
`;

function Result() {
  const [globalSearchMethod, setGlobalSearchMethod] = useState();
  const [globalData, setGlobalData] = useState();
  useEffect(() => {
    axios.get("/allData").then((res) => {
      let allData = res.data;
      let total = allData.length;
      console.log(allData);
      setGlobalData(allData);
    });
  }, []);

  const generateChartInfo = (survey, responses, questionNo, label) => {
    let optionsHolder = {};

    const surveyAnswers = responses.map((item) => {
      return item.surveyAnswers[questionNo];
    });
    survey.options.map((option) => {
      optionsHolder[option] = surveyAnswers.filter(
        (ans) => ans.answer === option
      );
    });
    let optionCount = [];
    survey.options.map((option) =>
      optionCount.push(optionsHolder[option].length)
    );

    console.log("optionCount", optionCount);
    const data = {
      labels: survey.options,
      datasets: [
        {
          label: survey.question,
          data: optionCount,
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    return data;
  };

  const { getSavedData } = useStore();
  const user = getSavedData("user");
  const assignedProduct = getSavedData("assignedProduct");
  const text = getSavedData("text");
  const voice = getSavedData("voice");
  const image = getSavedData("image");

  const backgroundColor = [
    "rgba(255, 99, 132)",
    "rgba(255, 159, 64)",
    "rgba(255, 205, 86)",
  ];

  const borderColor = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
  ];

  let AutomobileDataAccuracy = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Automobile accuracy graph",
        data: [86, 80, 60],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let AutomobileDataSearchTime = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Automobile search Time graph",
        data: [0.01, 0.05, 0.1],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let AutomobileDataShopping = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Automobile Shopping graph",
        data: [1, 1.5, 0.9],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  let ComputersDataAccuracy = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Computers accuracy graph",
        data: [78, 80, 40],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let ComputersDataSearchTime = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Computers search Time graph",
        data: [0.01, 0.05, 0.1],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let ComputersDataShopping = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Computers Shopping graph",
        data: [1, 0.9, 3],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  let FoodDataAccuracy = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Food accuracy graph",
        data: [92.03, 91.06, 99.23],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let FoodDataSearchTime = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Food search Time graph",
        data: [0.03, 0.09, 0.2],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let FoodDataShopping = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "Food Shopping graph",
        data: [2, 1.5, 0.5],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  let kitchenDataAccuracy = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "kitchen accuracy graph",
        data: [96.7, 70.39,32.45],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let kitchenDataSearchTime = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "kitchen search Time graph",
        data: [0.05, 0.03, 0.2],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let kitchenDataShopping = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "kitchen Shopping graph",
        data: [1, 1.5, 5],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };
  let fashionDataAccuracy = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "fashion accuracy graph",
        data: [40.6, 34.54, 97.34],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let fashionDataSearchTime = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "fashion search Time graph",
        data: [0.06, 0.05, 0.1],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let fashionDataShopping = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "fashion Shopping graph",
        data: [5, 4.3, 0.9],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  };

  let Question1 = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "How are you most likely to search for products ?",
        data: [80, 15, 5],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],

  };

  const rand = () => Math.round(Math.random() * 20 - 10);

  const devicePreferenceData = {
    labels: ["Mobile", "Laptop"],
    options: {
      plugins: {
        title: {
          text: "Which device are you most likely to search on ?",
          display: true,
        },
      },
    },
    datasets: [
      {
        type: "bar",
        label: "Text",
        backgroundColor: backgroundColor[0],
        borderColor: borderColor[0],
        borderWidth: 2,
        fill: false,
        data: [44, 56],
      },
      {
        type: "bar",
        label: "Voice",
        backgroundColor: backgroundColor[1],
        borderColor: borderColor[1],
        data: [67, 33],
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Image",
        backgroundColor: backgroundColor[2],
        borderColor: borderColor[2],
        data: [84, 16],
      },
    ],
  };

  const perceivedFailureData = {
    labels: ["Never", "Rarely", "Sometimes", "All the time"],
    options: {
      plugins: {
        title: {
          text: "How Often do theses Search methods fail you ?",
          display: true,
        },
      },
    },
    datasets: [
      {
        type: "bar",
        label: "Text",
        backgroundColor: backgroundColor[0],
        borderColor: borderColor[0],
        borderWidth: 2,
        fill: false,
        data: [80, 14, 5, 0],
      },
      {
        type: "bar",
        label: "Voice",
        backgroundColor: backgroundColor[1],
        borderColor: borderColor[1],
        data: [0, 67, 30, 3],
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Image",
        backgroundColor: backgroundColor[2],
        borderColor: borderColor[2],
        data: [0, 30, 37, 0],
      },
    ],
  };
  const stressedData = {
    labels: ["Very Stressful", "Stressful", "Neutral", "Pleasant"],
    options: {
      plugins: {
        title: {
          text: "How stressful are these search methods ?",
          display: true,
        },
      },
    },
    datasets: [
      {
        type: "bar",
        label: "Text",
        backgroundColor: backgroundColor[0],
        borderColor: borderColor[0],
        borderWidth: 2,
        fill: false,
        data: [5, 11, 90, 2],
      },
      {
        type: "bar",
        label: "Voice",
        backgroundColor: backgroundColor[1],
        borderColor: borderColor[1],
        data: [3, 10, 80, 7],
        borderColor: "white",
        borderWidth: 2,
      },
      {
        type: "bar",
        label: "Image",
        backgroundColor: backgroundColor[2],
        borderColor: borderColor[2],
        data: [10, 6, 82, 2],
      },
    ],
  };

/*   let Question1 = {
    labels: ["Text", "Voice", "Image"],
    datasets: [
      {
        label: "How are you most likely to search for products ?",
        data: [80, 15, 5],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],

  }; */
  return (
    <>
      <Header />
      <StyledResult>
        <div className="container">
          <div className="user-result">
            <div className="result-info">UserName: {user}</div>
            <div className="result-info">
              Assigned Product: {assignedProduct.productName}
            </div>
            <div className="result-info">
              Assigned Category: {assignedProduct.category}
            </div>
            <div className="result-info">
              Text search time: {text.searchTime}
            </div>
            <div className="result-info">
              Text shopping time: {text.timeToPurchase}
            </div>
            <div className="result-info">
              Text accuracy: {(text.accuracyCount.length / 21) * 100}%
            </div>

            <div className="result-info">
              voice search time: {voice.searchTime}
            </div>
            <div className="result-info">
              voice shopping time: {voice.timeToPurchase}
            </div>
            <div className="result-info">
              voice accuracy: {(voice.accuracyCount.length / 21) * 100}%
            </div>

            <div className="result-info">
              image search time: {image.searchTime}
            </div>
            <div className="result-info">
              image shopping time: {image.timeToPurchase}
            </div>
            <div className="result-info">
              image accuracy: {(image.accuracyCount.length / 21) * 100}%
            </div>
          </div>
          <div className="global charts">
            {globalData ? (
              <Doughnut
                data={generateChartInfo(instructions.survey[0], globalData, 0)}
              />
            ) : null}
            <h1>Automobile</h1>
            <Bar data={AutomobileDataAccuracy} />
            <Bar data={AutomobileDataSearchTime} />
            <Bar data={AutomobileDataShopping} />
            <h1>computers</h1>
            <Bar data={ComputersDataAccuracy} />
            <Bar data={ComputersDataSearchTime} />
            <Bar data={ComputersDataShopping} />
            <h1>Food and Grocery</h1>
            <Bar data={FoodDataAccuracy} />
            <Bar data={FoodDataSearchTime} />
            <Bar data={FoodDataShopping} />
            <h1>home & kitchen</h1>
            <Bar data={kitchenDataAccuracy} />
            <Bar data={kitchenDataSearchTime} />
            <Bar data={kitchenDataShopping} />
            <h1>fashion</h1>
            <Bar data={fashionDataAccuracy} />
            <Bar data={fashionDataSearchTime} />
            <Bar data={fashionDataShopping} />
            <h1>Survey section</h1>
            <Doughnut data={Question1} />
            <h2>How are you most likely to search for products ?</h2>
            {/* <Pie data={Question1}/> */}
            <Bar data={devicePreferenceData} />
            <h2>Which device are you most likely to search on ?</h2>
            <Bar data={perceivedFailureData} />
            <h2>How often do these search methods fail you ?</h2>
            <Bar data={stressedData} />
            <h2>How often do these search methods fail you ?</h2>
          </div>
        </div>
      </StyledResult>
    </>
  );
}

export default Result;

/*  const data = canvas => {
    const ctx = canvas.getContext('2d');
    //const g = ctx.createLinearGradient(...);
    console.log('this is ctx obj passed from donut',ctx);

    return {
        datasets: [{
            backgroundColor: g,
            // ...the rest
        }],
    };
} */
