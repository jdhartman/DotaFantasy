import React, { Component } from 'react';
import './index.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      username: '',
      email: '',
      password: '',
      error: ''
    }
    this.signUp = this.signIn.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  signIn = event => {
    this.props.firebase
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then((result) => {
        console.log(result.user);
        this.props.firebase.db.collection('users').doc(result.user.uid).get().then(snapshot => {
          this.setState({
            uid: result.user.uid,
            username: snapshot.data().username
          })
          this.props.closePop(this.state.uid, this.state.username);
        });
        
      })
      .catch(error => {
        console.log(error.message);
        this.setState({
            error: error.message
        })
      });

  }

  onChange = event => {
    //console.log(event.target.name);
    if(this.state.error) {
      this.setState({
        error: ''
      })
    }

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

          <h5>{this.state.error}</h5>
      </div>
    );
  }
}

export default SignIn;