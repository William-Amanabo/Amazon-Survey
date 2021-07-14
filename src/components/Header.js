import React from "react";
import styled  from "styled-components";

const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  box-shadow: 0 4px 8px #ffd00070;
  background-color: rgba(16, 14, 23, 1);
  nav {
    width: 90%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
    a {
      text-decoration: none;
    }

    .logo {
      text-align: center;
      p {
        font-size: 30px;
        font-weight: 600;
        color: rgb(255, 255, 255);
      }
      .yellow {
        color: #ffd000;
      }
    }
  }
`;
function Header({ children }) {
  return (
    <StyledHeader>
      <nav>
        <div className="logo">
          <p>
            Amazon<strong className="yellow">Survey</strong>
          </p>
        </div>
      </nav>
      {children}
    </StyledHeader>
  );
}

export default Header;
