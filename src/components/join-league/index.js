import React, { Component } from 'react';
import './index.css';

class JoinLeague extends Component {


  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      leagueName: '',
      pictures: '',
      pictureURL: '',
      loaded: false,
      leagues: [],
      leagueIds: [],
      invite: [],
      status: {}
    }

    this.join = this.join.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.renderInviteButton = this.renderInviteButton.bind(this);
    
    this.getInitialState();
  }

  getInitialState() {
    var myLeagues = [];
    var myStatus = {};
    var ids = [];
    var inv = [];

    console.log(this.state.uid);
    if(this.props.uid) {
      this.props.firebase.db.collection("users").doc(this.state.uid).collection("leagues").get().then(snapshot=> {
        snapshot.forEach(doc => {
          myStatus[doc.id] = doc.data().status; 
            
        });
        console.log(myStatus);
      }).then(() => {
        var statusKeys = Object.keys(myStatus);
        this.props.firebase.db.collection('leagues').get().then(snapshot => {
          snapshot.forEach(doc => {
            if(doc.data().commissioner !== "user_id") {
              console.log(doc.id);
              myLeagues.push(doc.data());
              if(statusKeys.includes(doc.id)) {
                inv.push(myStatus[doc.id]);
              }
              else {
                inv.push(-1);
              }
              ids.push(doc.id);
              
            }
          });


          this.setState({
            leagues: myLeagues,
            leagueIds: ids,
            invites: inv,
            status: myStatus
          })
        });
      })
      
    }
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

  

  join = (id, index) => {
    console.log(id);
    console.log(index);
    let inv = this.state.invites;
    inv[index] = true;
    this.props.firebase.db.collection("users").doc(this.state.uid).collection("leagues").doc(id).set({
        name : this.state.leagues[index].name,
        status: 0 //0 for invite requested, 1 for member, 2 for commissioner
    }).then(() => {
      this.setState({
        invites: inv
      })
    });
  }

  renderInviteButton(inv) {
    switch(inv) {
      case -1: 
        return "Request Invite";
      case 0:
        return "Invite Sent";
      case 1:
        return "Already Joined";
      case 2:
        return "Owner";
      default:
        return "Request Invite";
    }
  }


  render() {
    const myLeagues = this.state.leagues.map((item, i) => (
      <div key={i}>
        <h1 >{item.name}</h1>
        <img alt={item.name} src={item.photo}/>
        <div>
        <button disabled={this.state.invites[i] > -1} onClick={() => {this.join(this.state.leagueIds[i], i)}}>
          {this.renderInviteButton(this.state.invites[i])}
        </button>
        </div>
      </div>
    ));

    return ( 
      <div className="MyLeague">
      
      <p> Leagues </p>
      <div>{myLeagues}</div>
      </div>
    )
  }
}

export default JoinLeague;