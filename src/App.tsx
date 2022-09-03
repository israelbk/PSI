import React from 'react';
import './App.css';
import MainScreen from "./components/main-screen/main-screen";
import {observer} from "mobx-react";

function App() {
  return (
    <div className="App">
        <MainScreen/>
    </div>
  );
}

export default observer(App);
