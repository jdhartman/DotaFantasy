import React, { Component } from 'react';
import './index.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
    this.signUp = this.signIn.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  signIn = event => {
    this.props.firebase
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then((result) => {
        console.log(result.user);
        var dbUserName = this.props.firebase.db.ref('users/' + result.user.uid).once('value').then(snapshot => {
          this.props.closePop(result.user.uid, snapshot.val().username);
        });
        
      })
      .catch(error => {
        console.log(error);
      });

  }

  onChange = event => {
    console.log(event.target.name);
    switch(event.target.name) {
      case 'email': {
        this.setState ({
          email: event.target.value
        })
        break;
      }
      case 'password': {
        this.setState ({
          password: event.target.value
        })
        break;
      }
      default: {
        break;
      }
    }
  }

  render() {
    return (
      <div className="SignIn">
          <p> Login </p>
          <form>
            <input type="email" 
                   name="email"   
                   value={this.state.email}
                   placeholder="email"
                   onChange={this.onChange} 

            />
          </form>
          <form>
            <input type="password" 
                   name="password"   
                   value={this.state.password}
                   placeholder="password"
                   onChange={this.onChange} 
            />
          </form>

          <button onClick={this.signIn}> Login </button>
      </div>
    );
  }
}

export default SignIn;