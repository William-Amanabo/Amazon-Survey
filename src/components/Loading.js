import React from 'react'
import styled,{keyframes} from 'styled-components'

const spin = keyframes`
0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`
const StyledLoading = styled.div`
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);

  .loading-spinner {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border-top: #ffd000 20px solid;
    border-bottom: #ffd000 20px solid;
    border-right: transparent 20px solid;
    border-left: transparent 20px solid;
    background-color: transparent;
    animation: ${spin} 1s ease-in-out infinite forwards;
    transition: all 0.5s;
  }

}
`

function Loading() {
    return (
        <StyledLoading>
            <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
        </StyledLoading>
    )
}

export default Loading
