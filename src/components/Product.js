import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import instructions from "./instructions";

//TOD: style products for accuracy picking
//TOD: handle getting summary form the api

const reflect = keyframes`
  0% {
          transform: rotate(135deg) translate(50%, 800%);
        }
        100% {
          transform: rotate(135deg) translate(50%, -600%);
        }
`;
const StyledProduct = styled.div`
  width: 80%;
  max-width: 300px;
  animation: card-anim 1s ease-in-out;
  margin-bottom: 50px;
  transition: all 1s;
  position: relative;
  ${({ id, getSavedData, searchType }) => {
    return getSavedData(searchType).accuracyCount.includes(id)
      ? css`
          transform: translateY(-10px);
          
          .container{
            
            background-color:#ffb000 !important;
            box-shadow: 0 5px 10px 5px #ffd00070 !important;
          }
          .title, i{
            color: #000 !important;
          }
        `
      : null;
  }}

  .container {
    transition: all 1s;
    background-color: rgba(16, 14, 23, 1);
    margin: 0 auto;
    max-width: 600px;
    max-height: 900px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: inset 0 10px 18px 0 rgba(0, 0, 0, 0.1);
    -webkit-box-reflect: below -1px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
    position: relative;
    &::before {
      content: "";
      width: 500%;
      height: 100px;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.1);
      animation: ${reflect} 10s linear infinite forwards;
      z-index: -1;
    }

    .image {
      max-width: 600px;
      max-height: 350px;
      height: 240px;
      border-radius: 30px;
      height: 240px;
      padding: 20px;
      padding: 20px;
      background-repeat: no-repeat;
      background-size: contain;
      text-align: center;
      //border:var(--image-border);
    }
    .content {
      //padding: 0 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: rgb(255, 255, 255);
      width: 100%;

      .title {
        font-size: 1rem;
        font-weight: bold;
        align-self: center;
        padding: 0 25px;
        height: 50px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .summary {
        font-size: 1rem;
        font-weight: normal;
        padding: 5px;
        height: 150px;
        max-width: 90%;
        overflow: hidden;
        position: relative;
        text-overflow: ellipsis;
        display: none;
      }
      .ratings-container {
        display: inline-block;
        margin: 20px 20px 20px 25px;
        i {
          color: #ffb000;
          font-size: 1.5rem;
          font-weight: bold;
        }
      }
    }

    .purchase-button {
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
      &:hover {
        color: rgba(16, 14, 23, 1);
        background-color: #ffd000;
        box-shadow: 0px 0px 20px 0px #ffd000;
      }
    }
  }
  .price {
    &.ribbon {
      width: 150px;
      height: 150px;
      overflow: hidden;
      position: absolute;
      &::before,
      &::after {
        position: absolute;
        z-index: -1;
        content: "";
        display: block;
        border: 5px solid #ffd000;
      }
      span {
        position: absolute;
        display: block;
        width: 225px;
        padding: 15px 0;
        background-color: #ffb000;
        box-shadow: 0 5px 10px rgb(0 0 0 / 10%);
        color: #fff;
        font: 700 18px/1 "Lato", sans-serif;
        text-shadow: 0 1px 1px rgb(0 0 0 / 20%);
        text-transform: uppercase;
        text-align: center;
        background: linear-gradient(273deg, #ffffff, #ffd000, #ffb000);
        filter: drop-shadow(1px 1px 7px rgba(0, 0, 0, 0.7));
      }
    }

    &.ribbon-top-left {
      top: -10px;
      left: -10px;

      &::before,
      &::after {
        border-top-color: transparent;
        border-left-color: transparent;
      }

      &::before {
        top: 0;
        right: 0;
      }
      &::after {
        bottom: 0;
        left: 0;
      }
      span {
        right: -25px;
        top: 30px;
        transform: rotate(-45deg);
      }
    }
  }
`;
function Product({ id, name, image, ratings, price, summary }) {
  var {
    buyingProduct,
    purchaseTime,
    searchType,
    setBuyingProduct,
    displayModal,
    getSavedData,
    addToAccuracyCount,
  } = useStore();
  const [stars, SetStars] = useState([]);
  var purchaseProduct = () => {
    //TOD handle modal display and callback from here and put all functions into it
    displayModal(instructions.purchase, () => {
      purchaseTime("stop", searchType);
      setBuyingProduct(false);
      window.localStorage.setItem("buyingProduct", buyingProduct);
      setTimeout(() => {
        displayModal(instructions.accuracy);
      }, 1000);
    });
    //TOD modal display after a small interval to commence adding product to accuracy cart

    //TOD: make a function for advancing searchType
  };

  useEffect(() => {
    var displayStars = () => {
      //console.log("displaystars() runs");
      var rounded = Math.floor(ratings);
      var starsHolder = [];
      for (let i = 0; i < rounded; i++) {
        starsHolder.push(<i class="fa fa-star" aria-hidden="true"></i>);
      }
      if (ratings / rounded !== 1)
        starsHolder.push(<i class="fa fa-star-half-o" aria-hidden="true"></i>);
      for (let i = ratings; i < 4; i++) {
        starsHolder.push(<i class="fa fa-star-o" aria-hidden="true"></i>);
      }
      //console.log("starts", starsHolder);
      SetStars(starsHolder);
    };
    displayStars();
  }, [ratings]);
  return (
    <StyledProduct
      getSavedData={getSavedData}
      id={id}
      searchType={searchType}
      className="card"
      onClick={
        !buyingProduct ? addToAccuracyCount.bind(null, searchType, id) : null
      }
    >
      <div className="container">
        <img src={image} alt="" className="image" />

        <div className="content">
          <div className="title">{name}</div>
          <div className="ratings-container">{stars.map((items) => items)}</div>
          <div className="summary">{summary}</div>
        </div>

        {buyingProduct ? (
          <button className="purchase-button" onClick={purchaseProduct}>
            BUY
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="price ribbon ribbon-top-left">
        <span className="">${price}</span>
      </div>
    </StyledProduct>
  );
}

export default Product;
