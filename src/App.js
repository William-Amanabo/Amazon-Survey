import logo from "./logo.svg";
import "./App.css";
import "font-awesome/css/font-awesome.min.css";
import StateProvider from "./store/StateProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Search from "./components/Search";
import Survey from "./components/Survey";
import Modal from "./components/Modal";
import Result from './components/Result'
function App() {
  return (
    <>
      <Router>
        <StateProvider>
          <Modal />
          <Switch>
            <Route exact path="/" render={(props) => <Login />} />
            <Route path="/search" render={(props) => <Search />} />
            <Route path="/survey" render={(props) => <Survey />} />
            <Route path='/result' render={(props) => <Result />} />
          </Switch>
        </StateProvider>
      </Router>
    </>
  );
}

export default App;

/* 
<div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
*/
