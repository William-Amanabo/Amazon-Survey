import React, { useEffect } from "react";
import styled from "styled-components";
import instructions from "./instructions";
import useStore from "../store/useStore";
import Header from "./Header";

const StyledSurvey = styled.div`
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
    background-color: #100e17;
    display: flex;
    justify-content: left;
    align-items: center;
    flex-direction: column;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    .icon-container {
      border-radius: 20px;
      top: 0;
      padding: 10px;
      position: absolute;
      transform: translateY(-50%);
      background-color: #100e17;
      i {
        font-size: 4rem;
        font-weight: bold;
        color: #ffd000;
      }
    }

    .question {
      border-bottom: rgb(26, 24, 31) solid 1px;
      width: 90%;
      margin-top: 60px;
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .options {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 30px 0;
        label {
          position: relative;
          color: #fff;
          font-size: 12px;
          font-weight: 300;
          text-align: end;
          input {
            appearance: none;
            cursor: pointer;

            &:checked ~ .fa {
              color: #ffd000 !important;
              box-shadow: inset -1px -1px 3px rgba(255, 255, 255, 0.1),
                inset 2px 2px 6px rgba(0, 0, 0, 0.8);
              text-shadow: 0 0 5px #ffd000, 0 0 20px #ffd000;
            }
          }

          .fa {
            position: relative;
            width: 30px;
            height: 30px;
            background: #100e17;
            line-height: 30px;
            text-align: center;
            margin: 0 4px;
            color: #6f6f6f;
            font-size: 16px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: -1px -1px 3px rgba(255, 255, 255, 0.1),
              2px 2px 6px rgba(0, 0, 0, 0.8);

            &:hover {
              box-shadow: -1px -1px 3px rgba(255, 255, 255, 0.1),
                2px 2px 6px rgba(0, 0, 0, 0.8),
                inset -2px -2px 10px rgba(255, 255, 255, 0.05),
                inset 2px 2px 10px rgba(0, 0, 0, 0.5);
            }
          }
        }
      }
    }
    p {
      text-align: left;
      color: #fff;
      font-size: 1rem;
    }
    .primary-btn {
      padding: 5px;
      margin-top: 70px;
      width: 200px;
      font-size: 2rem;
      color: #ffd000;
      background-color: transparent;
      font-weight: bold;
      align-self: center;
      border: #ffb000 solid 1px;
      text-transform: capitalize;
      margin-bottom: 30px;
      transition: all 0.5s;
      border-radius: 20px;
      &:hover {
        color: #100e17;
        background-color: #ffd000;
        box-shadow: 0px 0px 20px 0px #ffd000;
      }
    }
  }
`;
function Survey() {
  var { displayModal, setSurveyAnswers, submitSurvey } = useStore();

  useEffect(() => {
    displayModal({ title: "Please fill out the questioner", content: "" });
  }, []);

  const submitForm = () => {
    var answers = [];
    instructions.survey.forEach((survey) => {
      var checked = document.querySelectorAll(
        `input[name=${survey.question.split(" ").join("")}]:checked`
      )[0];
      //console.log("answers", answers);
      if (checked === undefined) {
        console.log("checked with issues", checked);
        displayModal({
          title: "Error",
          content: "Please answer all questions",
        });
        return;
      }
      answers.push({
        question: survey.question,
        answer: checked.value,
      });
    });
    console.log(answers)
    setSurveyAnswers(answers);
    submitSurvey();
  };
  return (
    <>
      <Header />
      <StyledSurvey>
        <div className="container">
          <div className="icon-container">
            <i className="fa fa-calendar-check-o" aria-hidden="true"></i>
          </div>
          {instructions.survey.map((survey, index) => {
            return (
              <div className="question" id={index}>
                <div className="content">
                  <p>{survey.question}</p>
                </div>
                <div className="options">
                  {survey.options.map((option) => {
                    return (
                      <label>
                        <input
                          type="radio"
                          name={survey.question.split(" ").join("")}
                          value={option}
                        />
                        <i className="fa fa-check" aria-hidden="true"></i>
                        {option}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <button className="primary-btn" onClick={submitForm}>
            SUBMIT
          </button>
        </div>
      </StyledSurvey>
    </>
  );
}

/* let test = document.querySelectorAll('#first-question .options label input[type=radio]:checked')[0]
test.value
"false"
*/

export default Survey;
