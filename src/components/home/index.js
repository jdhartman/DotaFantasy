import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Popup from 'reactjs-popup';
import SignUp from '../signup';
import SignIn from '../signin';
import CreateLeague from '../create-league';
import JoinLeague from '../join-league';
import UserLeagues from '../user-leagues';
import './index.css';



class App extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      uid: '',
      username: '',
      button: 'Sign Up',
    }
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
    const CreateLeagueBase = withFirebase(CreateLeague);
    const UserLeaguesBase = withFirebase(UserLeagues);
    const JoinLeagueBase = withFirebase(JoinLeague);

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

          <div className="LeagueSetup">
            <Link to='/create'><button>Create a League</button></Link>
            <Link to={'/league/' + this.state.uid}><button>My Leagues</button></Link>
            <Link to={'/join'}><button>Join a League</button></Link>
          </div>

          <Switch>
            <Route path='/league/:uid' render={() => <UserLeaguesBase uid={this.state.uid} /> } />
            <Route path='/create' component={CreateLeagueBase}/>
            <Route path='/join' component={() => <JoinLeagueBase uid={this.state.uid} />}/>
          </Switch>

          

      </div>
    );
  }
}

export default withFirebase(App);
