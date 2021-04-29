import React, { useEffect, useState } from 'react';
import USMap from './USMap';
import FamilyList from './FamilyList'
import PlantList from './PlantList';
import PlantDetails from './PlantDetails';
import Favorites from './Favorites';

const App = () => {
  // the collection of all of the states
  const [statesData, setStatesData] = useState(null);
  const [gState, setGState] = useState({name : null, slug : null});
  const [family, setFamily] = useState(null);
  const [plant, setPlant] = useState(null);
  const [plantDetails, setPlantDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loginStatus, setLoginStatus] = useState(null);
  const [loginName, setLoginName] = useState(null);
  

  // This should only run once -- when the loginname is input
  // then fetch for the US State data and will then render the USMap
  useEffect(() => {
    (async () => {
      const res = await fetch('https://willhaley.com/assets/united-states-map-react/states.json');
      const statesData = await res.json();
      // Set the statesData with the data received from fetch().
      setStatesData(statesData);
    })();
  }, [loginName]);


  // until loginName value is delcared (default of null), show the login page
  // sets the loginName (w/o password) to send to backend
  // to associate a user's favorites with their login name
  if (!loginName) {
   return(
   <div id="formContainer">
    {/* // this is where the login will go */}
     <form id="loginForm" onSubmit={() => {
      //onClick={() => {method}}
                      const userNameVal = document.getElementById("userName");
                      const pwVal = document.getElementById("password");
                      const bodyData = {username: userNameVal.value, password: pwVal.value};
                    
                      fetch('/signup/new', {
                      // method
                      method: 'POST',
                      // headers
                      headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': 'application/json'
      
                      },
                      body: JSON.stringify(bodyData)
                  }) 
                  setLoginStatus(true);
                  setLoginName(userNameVal.value);
                  }} >
       {/* <label for="userName">Input User Name:</label> */}
       <input className="fav-input"
         type="text" 
         id="userName" 
         name="userName"
         placeholder="Enter username here"
       ></input>
       <input className="fav-input"
         type="password" 
         id="password" 
         name="password"
         placeholder="Enter password here"
       ></input>
       <button className="fav-button"
         type="submit"
         id='submit'
         name='submit' 
        >Sign Up</button>
      </form><br></br>
      <button className="fav-button" id="logIn" onClick={() => {
        const userNameVal = document.getElementById("userName");
        const pwVal = document.getElementById("password");
        const bodyData = {username: userNameVal.value, password: pwVal.value};
        fetch('/signup/login', {
          // method
          method: 'POST',
          // headers
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded'
            'Content-Type': 'application/json'

          },
          body: JSON.stringify(bodyData)
        }).then((res) => {
          console.log('res', res);
          return res.json();
        }).then((res) => {
          const { favorites, verification } = res;
          if(verification === true) {
            setLoginStatus(true);
            setLoginName(userNameVal.value);
            //or an array of arrays with two elements in each array
          //favorites will now be an array with objects containing {plantName: ..., notes: ...}
            console.log('favorites', favorites);
            setFavorites(favorites);
          };
        });
        
   
        }}>Log In</button> 
      </div>
    )
  }
 
  // If there is no statesData yet, show a loading indicator.
 if (!statesData) {
    return (
      <div>Loading...</div>
    );
  }

  return (

    <div id="outer-container">
      <div id = "info-container"> 
        <USMap 
          id="us-map" 
          statesData={statesData}
          setGState={setGState} 
          setFamily={setFamily}
          setPlant={setPlant}
          setPlantDetails={setPlantDetails}
          loginStatus={loginStatus}
        />
        <div id="listsContainer">
          <FamilyList 
            gState={gState}
            setGState={setGState}
            family={family}
            setFamily={setFamily}
            plant={plant}
            setPlant={setPlant}
            plantDetails={plantDetails}
            setPlantDetails={setPlantDetails}
            favorites={favorites}
            loginName={loginName}
          />
          <PlantDetails
            family={family}
            plant={plant}
            gState={gState}
            plantDetails={plantDetails}
            setPlantDetails={setPlantDetails}
            setFavorites={setFavorites}
            favorites={favorites}
            loginName={loginName}
          />
        </div>
      </div>

      <div id = "favorites-container"> 
        <Favorites 
          favorites={favorites} 
           loginName={loginName}
        />
      </div>
    </div>

  );
};

export default App;