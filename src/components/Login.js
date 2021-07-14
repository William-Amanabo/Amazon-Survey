import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useStore from "../store/useStore";
import { useHistory } from "react-router-dom";
import axios from "axios";
import instructions from "./instructions";
import Header from "./Header";
//TOD: Style the login page
const LoginStyled = styled.div`
  margin-top: 60px;
  .login-container {
    //width: 95%;
    align-self: center;
    //margin: auto;
    padding: 20px;
    margin-top: 220px;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-form {
      width: 100%;
      max-width: 500px;
      border-radius: 20px;
      background-color: rgba(16, 14, 23, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      .icon-container {
        border-radius: 50%;
        top: 0;
        padding: 10px;
        position: absolute;
        transform: translateY(-50%);
        background-color: rgba(16, 14, 23, 1);
        i {
          font-size: 4rem;
          font-weight: bold;
          color: #ffd000;
        }
      }

      p {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: bold;
        color: #fff;
        font-size: 3rem;
      }

      input {
        width: 80%;
        height: 3rem;
        max-width: 750px;
        border-radius: 20px;
        border: 1px solid #ffd000;
        font-size: 1.5rem;
        text-align: center;
        align-self: center;
        margin: 50px auto 30px auto;
      }

      .primary-btn {
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
          color: rgba(16, 14, 23, 1);
          background-color: #ffd000;
          box-shadow: 0px 0px 20px 0px #ffd000;
        }
      }
    }
  }
`;

function Login() {
  const [userName, setUserName] = useState("");
  const { createUser, displayModal, handleSearchTypeChange, setAssignedProduct } = useStore();
  const history = useHistory();
  useEffect(() => {
    displayModal(instructions.login);
    axios.get("/getAssignedProduct").then((res) => {
      console.log("parsed assignedProduct", res.data);
      setAssignedProduct(res.data);
      window.localStorage.setItem(
        "assignedProduct",
        JSON.stringify(res.data)
      );
    });
  }, []);

  const buttonSubmit = () => {
    if (userName !== "") {
      console.log("userName", userName);
      createUser(userName);
      //handleSearchTypeChange();
      history.push("/search");
    } else {
      displayModal({ title: "Error", content: "Please enter a username" });
      setUserName("");
    }
  };

  return (
    <>
      <Header />
      <LoginStyled>
        <div className="login-container">
          <div className="login-form">
            <div className="icon-container">
              <i className="fa fa-user-circle" aria-hidden="true"></i>
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Name Surname"
            />
            <button
              type="submit"
              onClick={buttonSubmit}
              className="primary-btn"
            >
              Submit
            </button>
          </div>
        </div>
      </LoginStyled>
    </>
  );
}

export default Login;
