import React, { useState } from "react";
import axios from "axios";
import styled, { css } from "styled-components";
import useStore from "../store/useStore";
import ProgressButton from "./ProgressButton";
import ImageCapture from "./ImageCapture";

//TOD: style searchBar voice recording active
const StyledSearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px 10px 10px;
  transition: all 0.5s;
  .text-search-box {
    width: 100%;
    max-width: 750px;
    padding: 5px;
    border-radius: 20px 0 0 20px;
    border: none;
    height: 25px;
    padding-left: 20px;
    border: 4px #fff solid;
    transition: border-color 0.5s;
    &:focus,
    &:focus + .primary-button {
      //box-shadow:0 0 20px 0 #ffd000 ;
      border-color: #ffd000 !important;
    }
  }
  .primary-button {
    height: 43px;
    width: 60px;
    border: none;
    border-radius: 0 20px 20px 0;
    margin-left: -2px;
    background-color: #ffd000;
    border: 2px #fff solid;
    transition: border-color 0.5s;
    i {
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }
  }
  .voice-search-container {
    transform: translateY(50%);
    border-radius: 50%;
    width: 75px;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #100e17;
    position: fixed;
    top: 20px;

    .voice-search-button {
      width: 60px;
      height: 60px;
      background-color: #ffd000;

      border-radius: 50%;
      border: none;
      border-width: 20px;
      i {
        color: #fff;
        font-size: bold;
        font-size: 32px;
      }
      ${({ isListening }) => {
        return isListening
          ? css`
              box-shadow: 0 0 10px 10px #b19000;
              i {
                color: rgba(16, 14, 23, 1);
              }
            `
          : null;
      }}
    }
  }

  .image-search-container {
    transform: translateY(60%);
    border-radius: 0 0 45px 45px;
    width: 200px;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #100e17;
    position: fixed;
    top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    box-shadow: 1px 15px 20px -20px #ffb000;
    .image-search-button {
      width: 60px;
      height: 60px;
      background-color: #ffd000;
      border-radius: 50%;
      border: none;
      border-width: 20px;
      i {
        color: #fff;
        font-size: bold;
        font-size: 32px;
      }
      &:active {
        box-shadow: 0 0 10px 10px #b19000;
        i {
          color: rgba(16, 14, 23, 1);
        }
      }
      .hidden-input {
        display: none;
      }
    }
  }
`;
function Searchbar({ type, result, loading }) {
  const [textInput, setTextInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { searchTime /* buyingProduct */ } = useStore();

  let speechRecognition = new window.webkitSpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.onresult = (result) => {
    console.log(result);
    setTextInput(result.results[0][0].transcript);
    textSearch();
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  /* const productRetrieval = async (keyword, number) => {
    products = [];
    loading(true);
    const scrapperResult = await amazonScraper.products({
      keyword: keyword,
      number: number,
    });
    loading(false);
    console.log(scrapperResult);
    scrapperResult.result.forEach((item) => {
      products.push({
        id: item.asin,
        name: item.title,
        image: item.thumbnail,
        ratings: item.reviews.rating,
        price: item.price.current_price,
      });
    });
    result(products);
  }; */

  const productRetrieval = async (input) => {
    loading(true);
    console.log("function loads with input:", input);
    let data = { keyword: input, number: 10 };
    /* fetch("http://localhost:5000/search", {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
      //body:{ keyword: input, number: 10 },
      mode:"no-cors"
    }).then((products) => {
      result(products);
      loading(false);
    }); */
    await axios.post("/search", { keyword: input, number: 10 }).then((res) => {
      console.log(res);
      result(res.data);
      loading(false);
    });
  };

  const textSearch = async () => {
    try {
      searchTime(type, productRetrieval.bind(this, textInput, 10)).then(
        setTextInput("")
      );
    } catch (err) {
      console.log(err);
    }
  };

  const voiceSearch = () => {
    //TODO: handle asynchronous nature of speechRecognition.onresult
    if (!isListening) {
      
      speechRecognition.start();
      setIsListening(!isListening);
    } else {
      
      speechRecognition.stop();
      setIsListening(!isListening);
    }
  };

  const uploadCroppedImage = () => {
    ImageCapture.show(null, (blob) => {
      const formData = new FormData();
      formData.append("croppedImage", blob /*, 'example.png' */);
      loading(true);
      searchTime(type, async () => {
        axios({
          method: "POST",
          url: "http://localhost:5000/ImageRecognition",
          data: formData,
        }).then((res) => {
          loading(false);
          result(res.data);
        });
      });
    });
  };

  const uploadImage = () => {
    var input = document.getElementById("hidden-input");
    input.click();
    input.onchange = (e) => {
      const image = e.target.files[0];
      if (image) {
        const blobURL = URL.createObjectURL(image);
        ImageCapture.show(blobURL, (blob) => {
          const formData = new FormData();
          formData.append("croppedImage", blob /*, 'example.png' */);
          loading(true);
          searchTime(type, async () => {
            axios({
              method: "POST",
              url: "http://localhost:5000/ImageRecognition",
              data: formData,
            }).then((res) => {
              loading(false);
              result(res.data);
            });
          });
        });
      }
    };
  };
  let RenderSearch = <div></div>;
  //TOD: Finish up voice and image search
  switch (type) {
    case "text":
      RenderSearch = (
        <>
          <input
            type="text"
            className="text-search-box"
            onChange={handleTextChange}
            value={textInput}
          />
          <button className="primary-button" onClick={textSearch}>
            <i className="fa fa-search" aria-hidden="true"></i>
            <ProgressButton result={result} />
          </button>
        </>
      );
      break;
    case "voice":
      RenderSearch = (
        <div className="voice-search-container">
          <button className="voice-search-button" onClick={voiceSearch}>
            {!isListening ? (
              <i className="fa fa-microphone" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-microphone-slash " aria-hidden="true"></i>
            )}
          </button>
        </div>
      );
      break;
    case "image":
      RenderSearch = (
        <div className="image-search-container capture">
          <button className="image-search-button" onClick={uploadCroppedImage}>
            <i className="fa fa-camera" aria-hidden="true"></i>
          </button>
          <button className="image-search-button" onClick={uploadImage}>
            <i className="fa fa-image" aria-hidden="true"></i>
            <input
              type="file"
              accept="image/*"
              className="hidden-input"
              id="hidden-input"
            ></input>
          </button>
        </div>
      );
      break;
    default:
      Error();
      break;
  }
  //console.log(RenderSearch)
  return (
    <>
      <StyledSearchBar isListening={isListening}>
        {RenderSearch}
      </StyledSearchBar>
      <ImageCapture />
    </>
  );
}

export default Searchbar;
