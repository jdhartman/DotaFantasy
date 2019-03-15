import React, { Component } from 'react';
import './index.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      re_password: '',
      uid: '',
      error: ''
    }
    this.signUp = this.signUp.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validated = this.validated.bind(this);

  }

  validated() {
    return this.state.password === this.state.re_password && 
      this.state.password && 
      this.state.email &&
      this.state.username;
  }

  signUp = async event => {

    if(!this.validated()) {
      this.setState({ 
        error: "Please fill out all forms"
      });
      return;
    }

    var newUserName = await this.props.firebase.db.collection("users")
      .where("username", "==", this.state.username).get()
      .catch(err => {
        console.log('Error getting documents', err);
      });

    console.log(newUserName.size);

    if(newUserName.size > 0) {
      this.setState({ 
        error: "Username already exists"
      });
      return;
    }
    else {
      this.props.firebase
        .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(authUser => {
          this.setState({
            uid: authUser.user.uid
          })
          this.props.firebase.db.collection("users").doc(this.state.uid).set({
              username: this.state.username
          })
          this.props.closePop(this.state.uid, this.state.username);
          
        })
        .catch(error => {
          console.log(error);
          this.setState({ 
            error: error.message
          });
        });
    }
    
  }


  onChange = event => {
    //console.log(event.target.name);
    if(this.state.error) {
      this.setState({
        error: ''
      })
    }

    switch(event.target.name) {
      case 'username': {
        this.setState ({
          username: event.target.value
        })
        break;
      }
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
      case 're-password': {
        this.setState ({
          re_password: event.target.value
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
      <div className="SignUp">
          <p> Sign Up </p>
          <form>
            <input type="text" 
                   name="username"   
                   value={this.state.username}
                   placeholder="username"
                   onChange={this.onChange} 

            />
          </form>
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
          <form>
            <input type="password" 
                   name="re-password"   
                   value={this.state.re_password}
                   placeholder="re-enter password"
                   onChange={this.onChange} 
            />
          </form>

          <button onClick={this.signUp}> Sign Up </button>
          <h5>{this.state.error}</h5>
      </div>
    );
  }
}

export default SignUp;