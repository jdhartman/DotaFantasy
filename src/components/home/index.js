import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Popup from 'reactjs-popup';
import logo from './logo.svg';
import SignUp from '../signup';
import './index.css';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: [],
      players: ["player 1", "player 2", "Moo", "Vause"],
      playerSearch: '',
      rows: []
    }
    this.getPlayers = this.getPlayers.bind(this);
  }

  componentDidMount() {
    fetch("https://api.opendota.com/api/proplayers")
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          var playerName = result.map(function (player) {
            return player.name;
          });
          playerName.sort();
          this.setState({
            start: playerName,
            players: playerName
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  }

  getPlayers = event => {
    
    var players = this.state.start.filter((name) => {
      return name.toLowerCase().startsWith(event.target.value.toLowerCase())
    })

    this.setState({
      players: players,
      playerSearch: event.target.value
    })
  }

  render() {
    const player = this.state.players.map((item, i) => (
        <tr>
          <td>{i}</td>
          <td>{item}</td>
        </tr>
      ));

    return ( 

      <div className="PlayerList">
        <form>
            <input type="text" 
                   name="playerSearch"   
                   value={this.state.playerSearch} 
                   onChange={this.getPlayers} 
            />
        </form>

        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Add</th>
            </tr>
          </thead>
        <tbody>{player}</tbody>
        </table>
      </div>
    )
  }
}

class App extends Component {
 
  

  render() {
    const SignUpForm = withFirebase(SignUp);
    return (
      <div className="App">
        <header className="App-header">
          <p> Dota Fantasy League </p>
        </header>
        <Popup trigger={<button>Sign Up</button>} 
          modal
          closeOnDocumentClick >
          <SignUpForm/>

        </Popup>
        <div id="player-list">
          <p> Search Player </p>
          <PlayerList />
        </div>

      </div>
    );
  }
}

export default App;
