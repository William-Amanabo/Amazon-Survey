import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import useStore from "../store/useStore";

//TOD: style Modal
const StyledModal = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  transition: all 1s;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateX(${({ visible }) => (visible ? 0 : "-90px")});
  pointer-events: ${({ visible }) => (visible ? "all" : "none")};
  //z-index: ${({ visible }) => (visible ? 3 : -3)};
  z-index: 3;
  .screen-shadow {
    position: absolute;
    width: 200%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.527);
    top: 0;
    left: 0;
    z-index: 2;
  }
  
  .instructions-container {
    align-self: center;
    margin: auto;
    padding: 20px;
    margin-top: ${({image})=>(image? 0: "95px")};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 3;

    .instructions-form {
      width: 100%;
      max-width: 700px;
      min-height: 400px;
      border-radius: 20px;
      background-color: #100e17;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: #fff;
        z-index: -1;
      }

      &:after {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: #fff;
        z-index: -2;
      }

      &:before,
      &:after {
        border-radius: 20px;
        background: linear-gradient(317deg, #ffd000, #000, #000, #000, #ffd000);
      }

      .icon-container {
        border-radius: 40%;
        top: 50%;
        padding: 15px;
        position: absolute;
        transform: translateY(-50%);
        background-color: transparent;
        i {
          font-size: 350px;
          font-weight: normal;
          color: #ffd00021;
          z-index: -1;
        }
      }
      .instruction-image {
        padding-top: 20px;
        width: 90%;
        max-width: 300px;
        max-height: 300px;
        z-index: 1;
      }

      .instruction-title {
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
        color: #ffd000;
        padding: 20px;
        padding-bottom: ${({image})=>(image? 0: "")};;
        text-transform: uppercase;
        z-index: 1;
      }

      .instruction-content {
        text-align: center;
        font-size: 1rem;
        color: #fff;
        padding: 20px;
        z-index: 1;
      }

      .btn-container {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 20px;
        width: 80%;
        .primary-btn {
          max-width: 200px;
          width: 40%;
          font-size: 1.5rem;
          color: #ffd000;
          background-color: transparent;
          font-weight: bold;
          align-self: center;
          border: #ffb000 solid 1px;
          text-transform: capitalize;
          margin-bottom: 30px;
          transition: all 0.5s;
          text-transform: capitalize;
          z-index: 1;
          &:hover {
            color: #100e17;
            background-color: #ffd000;
            box-shadow: 0px 0px 20px 0px #ffd000;
          }
        }
        .secondary-btn {
          max-width: 250px;
          width: 40%;
          font-size: 1.5rem;
          color: #100e17;
          background-color: rgba(255, 255, 255, 0.438);
          font-weight: bold;
          align-self: center;
          border: #fff solid 1px;
          text-transform: capitalize;
          margin-bottom: 30px;
          transition: all 0.5s;
          text-transform: capitalize;
          z-index: 1;
          &:hover {
            color: #100e17;
            background-color: #fff;
            box-shadow: 0px 0px 20px 0px #fff;
          }
        }
      }
    }
  }
`;
const Modal = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({});
  const [firstCallback, setFirstCallback] = useState({});
  const [secondCallback, setSecondCallback] = useState({});

  const modalHandler = ({ detail }) => {
    console.log(detail);
    console.log(detail.data, detail.firstCallback, detail.secondCallback);
    setFirstCallback({ call: detail.firstCallback });
    setSecondCallback({ call: detail.secondCallback });
    setVisible(true);
    setContent(detail.data);
  };

  const handleClick = (callback) => {
    console.log("the callback gets clicked automatically", callback);
    if (typeof callback === "function") {
      callback();
    }
    setVisible(false);
  };

  useEffect(() => {
    document.addEventListener("modal", modalHandler);
  }, []);

  return (
    <StyledModal visible={visible} image={content.productImage}>
      <div className="instructions-container">
        <div className="instructions-form">
          <div className="icon-container">
            <i className="fa fa-question-circle-o" aria-hidden="true"></i>
          </div>
          {content.productImage ? (
            <img src={content.productImage} className="instruction-image" />
          ) : null}
          <h1 className="instruction-title">{content ? content.title : ""}</h1>
          <p className="instruction-content">
            {content ? content.content : ""}
          </p>
          <div className="btn-container">
            <button
              className="primary-btn"
              onClick={handleClick.bind(this, firstCallback.call)}
            >
              {content
                ? content.primaryButton
                  ? content.primaryButton
                  : "close"
                : ""}
            </button>
            {secondCallback.call ? (
              <button
                className="secondary-btn"
                onClick={handleClick.bind(this, secondCallback.call)}
              >
                {content
                  ? content.secondaryButton
                    ? content.secondaryButton
                    : "close"
                  : ""}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="screen-shadow"></div>
    </StyledModal>
  );
};

Modal.show = (data, firstCallback, secondCallback) => {
  document.dispatchEvent(
    new CustomEvent("modal", {
      detail: {
        data: data,
        firstCallback: firstCallback,
        secondCallback: secondCallback,
      },
    })
  );
};

export default Modal;
