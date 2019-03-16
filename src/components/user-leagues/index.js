import React, { Component } from 'react';
import PlayerList from '../player-list';

class UserLeagues extends Component {


  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      leagueName: '',
      pictures: '',
      pictureURL: '',
      loaded: false,
      leagues: []
    }

    this.validate = this.validate.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    var myLeagues = [];

    console.log(this.state.uid);
    if(this.props.uid) {
      this.props.firebase.db.collection('users').doc(this.props.uid).collection("leagues").get().then(snapshot => {
        snapshot.forEach(doc => {
          myLeagues.push(doc.data()); 
        });

        this.getInitialState(myLeagues);
      });
    }
  }

  getInitialState(myLeagues) {
    this.setState({
      leagues: myLeagues
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.uid !== this.state.uid) {
      this.setState({uid: prevState.uid});
      this.getData({uid: prevState.uid});
    }


  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.uid !== prevState.uid){
      
      return {uid : nextProps.uid};
    }
    else return null;
  }

  

  validate = event => {

  }

  renderStatus(status) {
    switch(status) {
      case 0:
        return "Invite Sent";
      case 2:
        return "Owner";
    }
  }


  render() {
    const myLeagues = this.state.leagues.map((item, i) => (
      <div key={i} className="League">
        <h1>{item.name}</h1>
        <h6>{this.renderStatus(item.status)}</h6>
      </div>
    ));

    return ( 
      <div className="MyLeague">
      
      <p> My Leagues </p>
      <div>{myLeagues}</div>
      </div>
    )
  }
}

export default UserLeagues;