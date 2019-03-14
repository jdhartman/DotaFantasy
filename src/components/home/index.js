import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Popup from 'reactjs-popup';
import SignUp from '../signup';
import SignIn from '../signin';
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
      return name.toLowerCase().includes(event.target.value.toLowerCase())
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
 
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      uid: '',
      username: '',
      button: 'Sign Up'
    }
  }
  closePopUp = (uid, username) => {
    this.setState({
      open: false,
      uid: uid,
      username: username
    })
    console.log("UID: " + uid);
    console.log('Username: ' + username);

    if(username) {
      this.setState({
        button: 'Sign Out'
      })
    }
  }

  openPopUp = () => {
    this.setState({
      open: true
    })
  }


  render() {
    const SignUpForm = withFirebase(SignUp);
    const SignInForm = withFirebase(SignIn);
    return (
      <div className="App">
        <header className="App-header">
          <p> Dota Fantasy League </p>
          <h2>{this.state.username ? "Welcome,  " + this.state.username : ''}</h2>
        </header>
          <button onClick={this.openPopUp}>{this.state.button}</button>
          <Popup open={this.state.open}
            modal
            closeOnDocumentClick >
            <div className="Sign">
              <SignUpForm closePop={this.closePopUp}/>
              <SignInForm closePop={this.closePopUp}/>
            </div>
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
