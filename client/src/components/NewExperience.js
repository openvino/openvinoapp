import React, { Component } from "react";
import ExperienceService from "../services/experience.service";
import AuthService from "../services/auth.service";


class NewExperience extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      photoFileName: "string",
      answer1: "",
      answer2: "",
      answer3: "",
      qrValue: "string",
      statusId: 0,
      location: "string",
      userId: "",
      date: "2021-06-25T17:00:46.699Z",
      latitude: null,
      longitude: null,
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();


    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });

    window.navigator.geolocation.getCurrentPosition((success) =>
      this.setState({
        latitude: success.coords.latitude,
        longitude: success.coords.longitude,
      })
    );
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { currentUser } = this.state;

    this.setState({
      message: "",
      successful: false,
    });

      ExperienceService.addExperience(
        this.state.photoFileName,
        this.state.statusId,
        this.state.date,
        this.state.qrValue,
        this.state.location,
        this.state.userId,
        this.state.currentUser,
       
      ).then(
        (response) => {
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
  
  };

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
                photoFileName={this.state.photoFileName2}
              />
              <Step2
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                //answer1={this.state.answer1}
                //answer2={this.state.answer2}
                //answer3={this.state.answer3}
                date = {this.state.date}
                statusId = {this.state.statusId}
                qrValue = {this.state.qrValue}
                location = {this.state.qrValue}
                userId = {this.state.userId}
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
          value={props.photoFileName2}
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
        <label htmlFor="username">Question 1</label>
        <textarea
          className="form-control"
          id="answer1"
          name="answer1"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer1}
          onChange={props.handleChange}
        />
        <label htmlFor="username">Question 2</label>
        <textarea
          className="form-control"
          id="answer2"
          name="answer2"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer2}
          onChange={props.handleChange}
        />
        <label htmlFor="username">Question 3</label>
        <textarea
          className="form-control"
          id="answer3"
          name="answer3"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer3}
          onChange={props.handleChange}
        />
      </div>
      <button className="btn btn-primary float-right">Register</button>
    </React.Fragment>
  );
}

export default NewExperience;
