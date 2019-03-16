import React, { Component } from 'react';
import axios from 'axios';
var aws = require('aws-sdk'); 

// Configure aws with your accessKeyId and your secretAccessKey
aws.config.update({
  region: 'us-east-2', // Put your aws region here
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
})

const S3_BUCKET = process.env.REACT_APP_BUCKET

class CreateLeague extends Component {


  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      leagueName: '',
      picture: '',
      pictureURL: '',
      loaded: false
    }
    this.validate = this.validate.bind(this);
    this.checkValues = this.checkValues.bind(this);
    this.uploadPicture = this.uploadPicture.bind(this);
    this.sign_s3 = this.sign_s3.bind(this);
  }

  componentDidMount() {
    this.setState({
      uid: this.props.firebase.auth.currentUser.uid
    })
  }

  sign_s3 = (ev) => {
      const s3 = new aws.S3();  // Create a new instance of S3
      let file = this.state.picture;
      // Split the filename to get the name and type
      let fileParts = file.name.split('.');
      let fileName = fileParts[0];
      let fileType = fileParts[1];
    // Set up the payload of what we are sending to the S3 api
      const s3Params = {
        Bucket: S3_BUCKET + "/photos",
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: 'public-read'
      };
      // Make a request to the S3 API to get a signed URL which we can use to upload our file
      s3.getSignedUrl('putObject', s3Params, (err, data) => {
          if(err){
            console.log(err);
          }
          // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved. 
          const returnData = {
            signedRequest: data,
            url: `https://s3.us-east-2.amazonaws.com/${S3_BUCKET}/photos/${fileName}`
          };
          // Send it all back
          console.log(returnData);
          var signedRequest = returnData.signedRequest;
          var url = returnData.url;
          this.setState({pictureURL : url})
          console.log("Recieved a signed request " + signedRequest);
          
         // Put the fileType in the headers for the upload
          var options = {
            headers: {
              'Content-Type': fileType
            }
          };
          axios.put(signedRequest,file,options)
          .then(result => {
            console.log("Response from s3")
            console.log(result);
            this.props.firebase.db.collection("leagues").add({
                commissioner: this.state.uid,
                name: this.state.leagueName,
                photo: this.state.pictureURL
            }).then((docRef) => {
              this.props.firebase.db.collection("users").doc(this.state.uid).collection("leagues").doc(docRef.id).set({
                  name : this.state.leagueName,
                  status: 2 //0 for invite requested, 1 for member, 2 for commissioner
              });
            })
            
          })
          .catch(error => {
            alert("ERROR " + JSON.stringify(error));
          })
      });
    }

  async uploadPicture() {
    await this.sign_s3();
    console.log("UPLOAD");
  }

  validate = event => {

    if (event.target.type === 'file') {
      if (event.target.files[0].size < 256000) {
        var file = event.target.files[0];
        this.setState({
          picture: file
        }, () => {
          this.checkValues();
        });
      }
      else {
        console.log("Picture is too big");
      }
    }
    if(event.target.type === 'text') {
      this.setState({
        leagueName: event.target.value
      }, () => {
        this.checkValues();
      });
    }
  }

  checkValues() {
    if(this.state.picture && this.state.leagueName !== '') {
      this.setState({
        loaded: true
      })
    }
  }

  render() {
    return ( 
      <div className="CreateLeague">
      <form>
          <input type="text" 
                 name="leagueName"
                 placeholder="League Name"   
                 value={this.state.leagueName} 
                 onChange={this.validate} 
          />
      </form>

      <form>
      <input type="file" 
             accept=".jpg,.png,.tiff"
             name="leaguePicture"
             onChange={this.validate}  
      />
      </form>

      <button onClick={this.uploadPicture} disabled={!this.state.loaded}>Create League</button>
      </div>

    )
  }
}

export default CreateLeague;