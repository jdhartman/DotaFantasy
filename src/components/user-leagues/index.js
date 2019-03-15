import React, { Component } from 'react';
import PlayerList from '../player-list';

class UserLeagues extends Component {


  constructor(props) {
    super(props);
    this.state = {
      leagueName: '',
      picture: '',
      pictureURL: '',
      loaded: false,
      leagues: []
    }
    this.validate = this.validate.bind(this);
  }

  componentDidMount() {
    var myLeagues = [];
    this.props.firebase.db.collection('users').doc(this.props.firebase.auth.currentUser.uid).collection("leagues").get().then(snapshot => {
      snapshot.forEach(doc => {

        myLeagues.push(Object.values(doc.data())[0]);
        console.log(Object.values(doc.data())[0]);    

      });
      this.setState({
        leagues: myLeagues
      })
    });
  }

  

  validate = event => {

  }


  render() {
    const myLeagues = this.state.leagues.map((item, i) => (
      <h1>{item}</h1>
    ));

    return ( 
      <div className="MyLeague">
      
      <p> My Leagues </p>
      <div>{myLeagues}</div>

      <PlayerList/>
      </div>
    )
  }
}

export default UserLeagues;