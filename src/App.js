import React, {useState, useEffect} from 'react';
import logo from './pokedexLogo.png';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'

import axios from 'axios';
const types = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poision", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost"];


function App() {
  const [pokemon, setPokemon] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [typeFilter, setTypeFilter] = useState(new Set());
  const [weaknessFilter, setWeaknessFilter] = useState(new Set());

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
    .then(res => {
      const {pokemon: returnedPokemon} = res.data;
      console.log(returnedPokemon)
      setAllPokemon(_ => returnedPokemon);
      setPokemon(_=> returnedPokemon);
    })
    .catch(err => console.log(err));
  },[])

  const handleSearch = async (e) => {
    const {target} = e;
    const {value} = target;
    if(value === "" || value.length < 1){
      setPokemon(_ => allPokemon);
    }
    if(target.type === "text"){
      setSearchString(_ => value)
    }
    if(e.target.type === "checkbox"){
      if(target.id.includes("Weakness")){
        let wkCopy = new Set(weaknessFilter);
        wkCopy.has(value) ? wkCopy.delete(value) : wkCopy.add(value);
        setWeaknessFilter(wkCopy);
      }
      if(target.id.includes("Type")){
        let typeCopy = new Set(typeFilter);
        typeCopy.has(value) ? typeCopy.delete(value) : typeCopy.add(value);
        setTypeFilter(typeCopy);
      }
    }
  }

  useEffect(() => {
      let matchedPokemon = allPokemon;
      if(searchString.length > 0){
        console.log("true");
        matchedPokemon = matchedPokemon.filter(p => {
          return (p.name.toLowerCase().includes(searchString.toLowerCase()))
         });
      }
      if (typeFilter.size > 0 ){
        console.log("true2")
        matchedPokemon = matchedPokemon.filter(p => {
          let include = false;
          p.type.forEach(t => {if(typeFilter.has(t)){include = true}});
          return(include)
        })
      }
      if (weaknessFilter.size > 0){
        let include = false;
        matchedPokemon = matchedPokemon.filter(p => {
          p.weaknesses.forEach(w => {if(weaknessFilter.has(w)){include = true}});
          return(include)
        })
      }
      setPokemon(_ => matchedPokemon);
  }, [searchString, typeFilter, weaknessFilter])


  return (
    <div className="App">
      <header className="App-header">
          <Image src={logo} style={{height: 75, width: 75}} className="mx-2 me-2" alt="logo" />
          <h1>Pokédex</h1>
      </header>
      <div className="body-container">

          <Form>
            <Form.Group controlId="PokedexSearchText">
              <Form.Label>Search:</Form.Label>
              <Form.Control type="text" style={{width: "50vw", margin: "auto"}} value={searchString} onChange={handleSearch}/>
              <Form.Text className="text-muted"> Search for Pokemon </Form.Text>
            </Form.Group>
            <div className='d-flex justify-content-center'>
              <Form.Group controlId="PokedexSearchTypes" style={{width: "200px"}} className="me-5">
                <Form.Label className="fw-bold text-decoration-underline">Type Filters</Form.Label>
                {types.map((type) => {
                  return(
                    <Form.Check
                    type="checkbox"
                    id={`TypeCheckBox_${type.toLowerCase()}`}
                    label={type}
                    value={type}
                    checked={typeFilter.has(type)}
                    style={{width:"100"}}
                    onChange={handleSearch}
                    />
                    )
                  })}
              </Form.Group>
              <Form.Group controlId="PokedexSearchWeaknesses" style={{width: "200px"}}>
                <Form.Label className="fw-bold text-decoration-underline">Weakness Filters</Form.Label>
                {types.map((type) => {
                  return(
                    <Form.Check
                    type="checkbox"
                    id={`WeaknessCheckbox_${type.toLowerCase()}`}
                    label={type}
                    value={type}
                    checked={weaknessFilter.has(type)}
                    style={{width:"100"}}
                    onChange={handleSearch}
                    />
                    )
                  })}
                  </Form.Group>
              </div>
            </Form>
          

          { pokemon.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Type</th>
                  <th>Weaknesses</th>
                </tr>
              </thead>
              <tbody>
                {pokemon.map((p) => {
                  return(<tr className="align-middle">
                    <td><Image src={p.img} thumbnail={true} /></td>
                    <td>{p.name}</td>
                    <td>{p.num}</td>
                    <td>{p.type.map(t => (
                        <ul>{t}</ul>
                      ))}</td>
                    <td className="text-center">{p.weaknesses.map(w => (
                        <ul>{w}</ul>
                      ))}</td> 
                  </tr>)
                  } 
                )}
              </tbody>
            </Table>)
            :
            <Alert variant={"warning"}>"No results meet that search criteria"</Alert>
          }
        </div>
      </div>
  );
}

export default App;
