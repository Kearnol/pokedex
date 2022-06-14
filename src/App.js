import React, {useState, useEffect} from 'react';
import PokeTable from './views/PokeTable';
import logo from './pokedexLogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ViewPokemonDetails from './views/ViewPokemonDetails';
import axios from 'axios';


function App() {
  const [allPokemon, setAllPokemon] = useState([]);

  //fetch all pokemon at the top level for all sub-components to share
  useEffect(() =>{
    axios.get('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
    .then(res => {
      const {pokemon: returnedPokemon} = res.data;
      console.log(returnedPokemon)
      setAllPokemon(_ => returnedPokemon)
    })
    .catch(err => console.log(err));  
  }, [])
  
  
  return (
    <div className="App">
      <header className="App-header">
          <Image src={logo} style={{height: 75, width: 75}} className="mx-2 me-2" alt="logo" />
          <h1 className="ms-2">Pokédex</h1>
      </header>
      <Router>
        <Routes>
          <Route path={"/:num"} element={<ViewPokemonDetails allPokemon={allPokemon}/>} />
          <Route strict path="/" element={<PokeTable allPokemon={allPokemon}/>} />
        </Routes>
      </Router>
    </div>
    )
};

export default App;
