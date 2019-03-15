import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Popup from 'reactjs-popup';
import SignUp from '../signup';
import SignIn from '../signin';
import './index.css';
import players from '../../resouces/players';

class PlayerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: [],
      players: [],
      playerSearch: '',
      rows: []
    }
    this.getPlayers = this.getPlayers.bind(this);
  }

  componentDidMount() {
    var keys = Object.keys(players);
    console.log(keys);
    var newPlayer = [];
    var sortedPlayer = [];
    console.log(players[keys[0]]);

    for(var i = 0; i < keys.length; i++) {
      for (var play in players[keys[i]]) {
        newPlayer.push(players[keys[i]][play])
        console.log(play);
      }
    }
    
    sortedPlayer = newPlayer.sort(function(a,b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });


    console.log(newPlayer);

    this.setState({
      start: sortedPlayer,
      players: sortedPlayer,
      keyStart: keys,
      keys: keys
    })
  }

  getPlayers = event => {
    
    var players = this.state.start.filter((name) => {
      return name.name.toLowerCase().includes(event.target.value.toLowerCase()) || 
        name.team.toLowerCase().includes(event.target.value.toLowerCase())
    })

    this.setState({
      players: players,
      playerSearch: event.target.value
    })
  }

  render() {
    const player = this.state.players.map((item, i) => (
        <tr key={i}>
          <td>{item.name}</td>
          <td>{item.country}</td>
          <td>{item.team}</td>
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
              <th>Country</th>
              <th>Team</th>
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
      button: 'Sign Up',
    }
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log("user logged in");
        console.log(user);

        this.props.firebase.db.collection('users').doc(user.uid).get().then(snapshot => {
          this.setState({
            uid: user.uid,
            username: snapshot.data().username,
            button: 'Sign Out'
          })
        });

      } else {
        // No user is signed in.
        console.log("no user");
        this.setState({
          uid: '',
          username: '',
          button: 'Sign Up'
        })
      }
    });
    console.log(this.props.firebase.auth.currentUser);
  }

  componentWillUnmount() {
    this.listener();
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
    if(this.state.uid) {
      this.props.firebase.doSignOut()
      .catch(error => {
        console.log(error);
      })
    }
    else {
      this.setState({
        open: true
      })
    }
    
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

export default withFirebase(App);
