import React, {useState, useEffect} from 'react';
import PokeTable from './views/PokeTable';
import logo from './pokedexLogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Image src={logo} style={{height: 75, width: 75}} className="mx-2 me-2" alt="logo" />
          <h1>Pokédex</h1>
      </header>
      <PokeTable/>
    </div>
    )
};

export default App;
