import React, { Component } from "react";
import ExperienceService from "../services/experience.service";
import AuthService from "../services/auth.service";
import qrService from "../services/qr.service";

class NewExperience extends React.Component {
  constructor(props) {
    super(props);
    this.onChangePhotoFileName = this.onChangePhotoFileName.bind(this);

    this.state = {
      currentStep: 1,
      photoFileName: '',
      qrValue: '',
      statusId: '',
      location: '',
      userId: '',
      date: '',
      latitude: null,
      longitude: null,
    };
  }

  componentDidMount() {
    //const questions = ExperienceService.getQuestions(1);
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    const qrCode = qrService.getQRClaimed();
    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    this.setState({ qrValue: qrCode});
    this.setState({ userId: currentUser.id});
    this.setState({ date: Date()});

    console.log(currentToken);
    console.log(currentUser);
    console.log(currentUser.id)
    console.log(qrCode);
    //console.log(questions);
    window.navigator.geolocation.getCurrentPosition((success) =>
      this.setState({
        latitude: success.coords.latitude,
        longitude: success.coords.longitude,
      })
    );
  }
  onChangePhotoFileName(e) {
    this.setState({
      photoFileName: e.target.value,
    });
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
    });

    //this.form.validateAll();

      ExperienceService.addExperience(
        this.state.photoFileName,
        
        
      ).then(
        (response) => {
          this.props.history.push("/app/experiences");
          window.location.reload();
          this.setState({
            message: response.data.message,
            successful: true,
          });
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    
  }
  
  _next = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  _prev = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  /*
   * the functions for our button
   */
  previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this._prev}
        >
          Previous
        </button>
      );
    }
    return null;
  }

  nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 2) {
      return (
        <button
          className="btn btn-primary float-right"
          type="button"
          onClick={this._next}
        >
          Next
        </button>
      );
    }
    return null;
  }
  render() {
    console.log(this.state.qrValue);
    console.log(this.state.date);
    console.log(this.state.statusId);
    console.log(this.state.location);
    console.log(this.state.userId);
    console.log(this.state.photoFileName);
    return (
      <React.Fragment>
        <div className="col-md-12">
          <div className="card card-container login-form">
            <h1>Add New Experience</h1>
            <span className="subh1">Step {this.state.currentStep} </span>

            <form onSubmit={this.handleSubmit}>
              {/* 
          render the form steps and pass required props in
        */}
              <Step1
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
              />
              <Step2
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                answer1={this.state.answer1}
                answer2={this.state.answer2}
                answer3={this.state.answer3}
                answer4={this.state.answer4}
                answer5={this.state.answer5}
                
              />
              {this.previousButton()}
              {this.nextButton()}
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null;
  }
  return (
    <div className="form-group">
      <label className="cameraButton">
        <i className="fas fa-camera-retro"></i> Take a picture
        <input
          type="file"
          name="photoFileName"
          value={props.photoFileName}
          onChange={props.handleChange}
          accept="image/*;capture=camera"
        />
      </label>
    </div>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null;
  }
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor="username">Are you sharing this bottle with other people? How many?</label>
        <textarea
          className="form-control"
          id="answer1"
          name="answer1"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer1}
          onChange={props.handleChange}
        />
        <label htmlFor="username">Did you buy this bottle with crypto? or in a shop or restaurant? was it a gift?</label>
        <textarea
          className="form-control"
          id="answer2"
          name="answer2"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer2}
          onChange={props.handleChange}
        />
        <label htmlFor="username">Are you drinking this wine with food? What are you eating?</label>
        <textarea
          className="form-control"
          id="answer3"
          name="answer3"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer3}
          onChange={props.handleChange}
        />
        <label htmlFor="username">Do you like this wine? How would you rank it?</label>
        <textarea
          className="form-control"
          id="answer4"
          name="answer4"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer4}
          onChange={props.handleChange}
        />
         <label htmlFor="username">Do you think we should build a colony on Mars?</label>
        <textarea
          className="form-control"
          id="answer5"
          name="answer5"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer5}
          onChange={props.handleChange}
        />
      </div>
      <button className="btn btn-primary float-right">Register</button>
    </React.Fragment>
  );
}

export default NewExperience;
