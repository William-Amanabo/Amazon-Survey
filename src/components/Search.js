import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";
import Searchbar from "./Searchbar";
import instructions from "./instructions";
import Product from "./Product";

import Header from "./Header";
import Loading from "./Loading";
import ProgressButton from "./ProgressButton";
import styled from "styled-components";

const StyledProductContainer = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  justify-items: center;
  transition: all 0.5s;
  margin-top: 160px;
`;

function Search() {
  let { searchType, displayModal, purchaseTime, assignedProduct } = useStore();
  let [searchResult, setSearchResult] = useState([]);
  let [isLoading, setIsLoading] = useState();

  useEffect(() => {
    //TOD handle displaying of modal when searchType changes, especially on first render
    console.log("SearchGlobal already fired");
    console.log("assignedProduct",assignedProduct)
    displayModal(
      { ...instructions.search[searchType], ...assignedProduct },
      () => purchaseTime("start", searchType)
    );
  }, [searchType]);
  return (
    <>
      <Header>
        <Searchbar
          type={searchType}
          result={setSearchResult}
          loading={setIsLoading}
        />
        <ProgressButton result={setSearchResult} />
      </Header>
      {isLoading ? (
        <Loading />
      ) : searchResult.length === 0 ? (
        <div
          className="no-item"
          style={{
            color: "#100E17",
            fontSize: "4rem",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%,-50%)",
            left: "50%",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          Product not found
        </div>
      ) : (
        <StyledProductContainer>
          {searchResult.map((item) => (
            <Product
              id={item.id}
              name={item.name}
              image={item.image}
              ratings={item.ratings}
              price={item.price}
              key={item.id}
            />
          ))}
        </StyledProductContainer>
      )}
    </>
  );
}

export default Search;
