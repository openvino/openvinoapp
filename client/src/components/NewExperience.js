import React, { Component } from "react";
import ExperienceService from "../services/experience.service";
import AuthService from "../services/auth.service";
import qrService from "../services/qr.service";
import { withRouter } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const qrCode = (value) => {
  if (value == false) {
    return (
      <div className="alert alert-danger" role="alert">
        Invalid QR Code.
      </div>
    );
  }
};

class NewExperience extends React.Component {
  constructor(props) {
    super(props);
    this.onChangePhotoFileName = this.onChangePhotoFileName.bind(this);

    this.state = {
      currentStep: 1,
      photoFileName: "",
      ipfsUrl: "",
      qrValue: "",
      statusId: 5,
      location: "",
      userId: "",
      date: "",
      latitude: null,
      longitude: null,
      experienceId: "",
    };
  }

  componentDidMount() {
    //const questions = ExperienceService.getQuestions(1);
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    const qrCode = qrService.getallowClaim();
    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    this.setState({ qrValue: qrCode });
    this.setState({ userId: currentUser.id });
    this.setState({ date: new Date() });
    this.setState({ location: "Mendoza" });
    console.log(currentToken);
    console.log(currentUser);
    console.log(currentUser.id);
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

    // grabación de la experiencia y de las respuesta
    // la busqueda de las preguntas no debería ir acá

    ExperienceService.addExperience(
      this.state.photoFileName,
      this.state.statusId,
      this.state.date,
      this.state.userId,
      this.state.location,
      this.state.qrValue,
      this.state.ipfsUrl
    ).then(
      (response) => {
        // *** comento para que no me refresque pa pàgina y pueda ver la consola ***
        this.props.history.push("/app/user");
        window.location.reload();

        //valido el status de la respuesta para saber si la experiencia se grabó correctamente
        if (response.data.status) {
          // la experiencia se grabó exitosamente
          this.setState({
            message: response.data.message,
            experienceId: response.data.experienceId,
            successful: true,
          });

          // grabar respuestas
          // *** prueba obtener pregutas, esto no debería estar acà, las preguntas
          // debería buscarlas antes para mostrarlas en la interface ***
          // la grabación esta dentro de la búsqueda solo para que se realicen en ese orden sincrónico
          let arrQuestions = [];
          ExperienceService.getQuestions().then(
            (response) => {
              // transformo el json a un array
              arrQuestions.push(response.data[0].question1);
              arrQuestions.push(response.data[0].question2);
              arrQuestions.push(response.data[0].question3);
              arrQuestions.push(response.data[0].question4);
              arrQuestions.push(response.data[0].question5);

              // *** prueba grabar preguntas ***
              // armo un array con las respuetas y paso ambos array para grabar
              const arrAnswers = [
                this.state.answer1,
                this.state.answer2,
                this.state.answer3,
                this.state.answer4,
                this.state.answer5,
              ];
              ExperienceService.saveQuestions(
                this.state.experienceId,
                arrQuestions,
                arrAnswers
              );
            },
            (error) => {
              console.log(error.toString());
            }
          );
        } else {
          // *** la experiencia no se grabó, no avanzar en la ejecución  ***
          this.setState({
            message: response.data.message,
            experienceId: 0,
            successful: false,
          });
        }
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
    console.log(this.state.qrValue);
    console.log(this.state.date);
    console.log(this.state.location);
    console.log(this.state.userId);
    console.log(this.state.photoFileName);
    console.log(this.state.ipfsUrl);
    if (this.state.qrValue == true) {
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
  } else {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <div className="card card-container login-form">
            <h1 style={{
                fontSize: '35px',
                fontWeight: 'bold',
                color: '#B0195C',
                lineHeight: '33px'
          }}>SCAN YOUR QR CODE</h1>
            <p style={{
                marginTop: '20px'
          }}>First, you have to scan the QR Code that is in the reverse of your wine bottle.</p>
          </div>
        </div>
      </React.Fragment>
    ) 
  }
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
          validations={[required]}
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
        <label htmlFor="username">
          Are you sharing this bottle with other people? How many?
        </label>
        <textarea
          className="form-control"
          id="answer1"
          name="answer1"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer1}
          onChange={props.handleChange}
        />
        <label htmlFor="username">
          Did you buy this bottle with crypto? or in a shop or restaurant? was
          it a gift?
        </label>
        <textarea
          className="form-control"
          id="answer2"
          name="answer2"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer2}
          onChange={props.handleChange}
        />
        <label htmlFor="username">
          Are you drinking this wine with food? What are you eating?
        </label>
        <textarea
          className="form-control"
          id="answer3"
          name="answer3"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer3}
          onChange={props.handleChange}
        />
        <label htmlFor="username">
          Do you like this wine? How would you rank it?
        </label>
        <textarea
          className="form-control"
          id="answer4"
          name="answer4"
          type="textarea"
          placeholder="Enter your answer"
          value={props.answer4}
          onChange={props.handleChange}
        />
        <label htmlFor="username">
          Do you think we should build a colony on Mars?
        </label>
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

export default withRouter(NewExperience);
