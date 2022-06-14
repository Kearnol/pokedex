import React, {useState, useEffect} from 'react';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'

import axios from 'axios';
const types = ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost"];


function PokeTable({allPokemon}) {
  const [pokemon, setPokemon] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [typeFilter, setTypeFilter] = useState(new Set());
  const [weaknessFilter, setWeaknessFilter] = useState(new Set());
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setPokemon(allPokemon);
  }, [allPokemon])

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

      // first, filter by search string if it exists
      if(searchString.length > 0){
        matchedPokemon = matchedPokemon.filter(p => p.name.toLowerCase().includes(searchString.toLowerCase()))
        }
      
      // second, filter by type, if any are selected. Otherwise don't add a type filter. 
      if (typeFilter.size > 0 ){

        // create an array from the set
        let typeArray = Array.from(typeFilter);
        
        // filter matchedPokemon[] returning only pokemon who include every type in typeFilter
        // p - pokemon
        // t - type in typeFilter
        matchedPokemon = matchedPokemon.filter(p => {
          return typeArray.every(t => {
            if(p.type.indexOf(t) > -1){
            }
            return(p.type.includes(t));
          });
        })
        // see the filtered result
        console.log("matchedPokemnon::useEffect1", matchedPokemon)
      }

      // lastly, filter by weakness, if any selected. Otherwise don't add a weakness filter
      if (weaknessFilter.size > 0){
        // create an array from the set to perform array methods
        let weaknessArray = Array.from(weaknessFilter);
        
        // filter matchedPokemon[] returning only pokemon who include every weakness in weaknessFilter
        // p - pokemon
        // t - type in typeFilter
        matchedPokemon = matchedPokemon.filter(p => {
          return weaknessArray.every(w => {
            return(p.weaknesses.includes(w));
          });
        })
        // see the filtered result
        console.log("matchedPokemnon::useEffect2", matchedPokemon)
    }

    // set Pokemon[] (state) to our filtered list. Pokemon[] renders the table items. 
    setPokemon(_ => matchedPokemon);
  }, [searchString, typeFilter, weaknessFilter])


  return (
      <div className="body-container">
          <Form>
            <Form.Group controlId="PokedexSearchText">
              <Form.Label>Search Count: {pokemon.length} </Form.Label>
              <Form.Control type="text" style={{width: "50vw", margin: "auto"}} value={searchString} onChange={handleSearch}/>
              <Form.Text className="text-muted"> Search for Pokemon by name and filter by type and weakness.</Form.Text>
            </Form.Group>
              <Button variant="primary" className="my-2" onClick={() => setShowFilters(state => !state)}> Toggle Filters </Button>
                {showFilters && (
                <div className='d-flex justify-content-center'>
                  <Form.Group controlId="PokedexSearchTypes" style={{width: "200px"}} className="me-5">
                    <Form.Label className="fw-bold text-decoration-underline">Type Filters</Form.Label>
                    {types.map((type) => {
                      return(
                        <Form.Check
                        type="checkbox"
                        id={`TypeCheckBox_${type.toLowerCase()}`}
                        key={`TypeCheckBox_${type.toLowerCase()}`}
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
                        key={`WeaknessCheckbox_${type.toLowerCase()}`}
                        label={type}
                        value={type}
                        checked={weaknessFilter.has(type)}
                        style={{width:"100"}}
                        onChange={handleSearch}
                        />
                        )
                      })}
                      </Form.Group>
                  </div>)}
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
                  return(
                  <tr className="align-middle" key={p.name}>
                    <td>
                        <Image src={p.img} thumbnail={true} />
                    </td>
                    <td>
                      <Link to={p.num}>
                        {p.name}
                      </Link>
                    </td>
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
            </Table>
            ) :
            <Alert variant={"warning"}>"No results meet that search criteria"</Alert>
          }
        </div>
        )
};

export default PokeTable;
