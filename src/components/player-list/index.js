import React, { Component } from 'react';
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
    this.getInitialState = this.getInitialState.bind(this);

  }

  componentDidMount() {
    console.log("COMPONENT DID MOUNT");
    var keys = Object.keys(players);
    //console.log(keys);
    var newPlayer = [];
    var sortedPlayer = [];
    //console.log(players[keys[0]]);

    for(var i = 0; i < keys.length; i++) {
      for (var play in players[keys[i]]) {
        newPlayer.push(players[keys[i]][play])
        //console.log(play);
      }
    }
    
    sortedPlayer = newPlayer.sort(function(a,b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    this.getInitialState(sortedPlayer, keys);
  }

  getInitialState(sortedPlayer, keys) {

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

export default PlayerList;