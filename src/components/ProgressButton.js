import React from "react";
import styled from "styled-components";
import useStore from "../store/useStore";
import instructions from './instructions'

const StyledProgressButton = styled.button`
  position: fixed;
        top:150px;
        right: -5px;
        width: 75px;
        color: white;
        border-radius: 20px 0 0 20px;
        background-color: #ffd000;
        font-weight: bold;
        border: #ffb000 solid 1px;
        text-transform: uppercase;
        padding: 10px 0;
        transition: all 0.5s;
        &:hover, &:active{
          box-shadow: 0 0 10px 10px #b19000;
            color: rgba(16, 14, 23, 1);
        }
`;
//TOD: styleProgressButton
function ProgressButton({result}) {
  const { buyingProduct, displayModal, purchaseTime, handleSearchTypeChange, searchType,handleNotFound } = useStore();
  const handleClick = () =>{
      if (buyingProduct){
          displayModal(instructions.notFound,()=>{
            purchaseTime("stop", searchType);
            handleNotFound(searchType);
            handleSearchTypeChange();
          },()=>{ })
      } else{
          handleSearchTypeChange();
          //result([])
      }
  }
  return (
    <StyledProgressButton className="Done" onClick={handleClick}>{buyingProduct ? "Done" : "done"}</StyledProgressButton>
  );
}

export default ProgressButton;
