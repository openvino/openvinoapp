import React from 'react';
import ExperienceService from '../services/experience.service';
import AuthService from '../services/auth.service';
import qrService from '../services/qr.service';
import { withRouter } from 'react-router-dom';
import { create } from 'ipfs-http-client';
import { Redirect } from 'react-router-dom';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import TextArea from 'react-validation/build/textarea';
import CheckButton from 'react-validation/build/button';
import i18next from 'i18next';
import loading from '../assets/images/loading.gif';
import dotenv from 'dotenv';
import LoadingSpinner from './Spinner';
dotenv.config();

const { REACT_APP_API_KEY_SECRET, REACT_APP_API_KEY } = process.env;

// Accepted Images file types
const acceptedImagesFormat = ['jpeg', 'png', 'heic', 'jpg'];

/* Create an instance of the client */
const auth =
  'Basic ' +
  Buffer.from(REACT_APP_API_KEY + ':' + REACT_APP_API_KEY_SECRET).toString(
    'base64'
  );

const client = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
  headers: {
    authorization: auth,
  },
});

// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// });

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        {i18next.t('This field is required!')}
      </div>
    );
  }
};

// const qrCode = (value) => {
//   if (value === false) {
//     return (
//       <div className="alert alert-danger" role="alert">
//         Invalid QR Code.
//       </div>
//     );
//   }
// };

class NewExperience extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeFile = this.onChangeFile.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      ipfsUrl: '',
      ipfsUrlJson: '',
      qrValue: '',
      photoFileName: '',
      statusId: 5,
      location: '',
      userId: '',
      date: '',
      latitude: null,
      longitude: null,
      experienceId: '',
      qRCodeClaim: '',
      nftGenerated: false,
      redirect: null,
      userReady: false,
      currentUser: { email: '' },
      imgPlaceHolder: null,
      loading: false,
    };
  }

  componentDidMount() {
    //const questions = ExperienceService.getQuestions(1);
    const currentUser = AuthService.getCurrentUser();
    const currentToken = AuthService.getToken();
    const qrCode = qrService.getQRClaimed();
    const qRCodeClaim = qrService.getallowClaim();
    console.log('currentUser:', currentUser);
    console.log('currentToken:', currentToken);
    console.log('qrCode:', qrCode);
    console.log('qRCodeClaim:', qRCodeClaim);
    if (!currentUser) {
      this.setState({ redirect: '/' });
    } else {
      this.setState({ userId: currentUser.id });
      if (!qRCodeClaim) {
        this.setState({ redirect: `/app/user` });
      }
    }
    this.setState({ currentUser: currentUser, userReady: true });
    this.setState({ currentToken: currentToken, userReady: true });
    this.setState({ qrValue: qrCode });
    this.setState({ qRCodeClaim: qRCodeClaim });
    this.setState({ date: new Date() });
    this.setState({ location: 'Mendoza' });
    //console.log(currentToken);
    console.log('currentUser', currentUser);
    console.log('currentUser.id', currentUser.id);
    //console.log(qrCode);
    //console.log(questions);
    window.navigator.geolocation.getCurrentPosition((success) =>
      this.setState({
        latitude: success.coords.latitude,
        longitude: success.coords.longitude,
      })
    );
  }

  async onChangeFile(e) {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    this.setState({
      photoFileName: loading,
    });
    let imageType = file.name.toString();
    var fileType = imageType.split('.').pop();
    console.log('Image extension', `"${fileType}"`);

    if (JSON.stringify(acceptedImagesFormat).includes(`"${fileType}"`)) {
      console.log('Image type supported!!');
      this.setState({
        loading: true,
      });
      try {
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        const placeHolderImg = `https://ipfs.io/ipfs/${added.path}`;
        console.log('Trying IPFS upload...');
        if (url === 'https://ipfs.infura.io/ipfs/Users') {
          console.warn('Error uploading to IPFS.');
          alert('Failed to uplaod to IPFS, try again!!');
          window.location.reload();
          // this.setState({
          //   photoFileName: null
          // });
        } else {
          console.log('Success uploading to IPFS!!');
          this.setState({
            photoFileName: url,
          });

          this.setState({
            imgPlaceHolder: placeHolderImg,
          });
        }
      } catch (error) {
        console.log('Error uploading file: ', error);
      } finally {
        this.setState({
          loading: false,
        });
      }
    } else {
      // Break the instance, alert user that image/type is not supported.
      console.warn('Image type not supported...');
      alert('Image type not supported.');
      this.setState({
        photoFileName: null,
      });
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.ipfsUrl);
    this.setState({
      message: '',
      successful: false,
    });

    this.form.validateAll();

    // grabación de la experiencia y de las respuesta
    // la busqueda de las preguntas no debería ir acá
    if (this.checkBtn.context._errors.length === 0) {
      ExperienceService.addExperience(
        this.state.statusId,
        this.state.date,
        this.state.userId,
        this.state.location,
        this.state.qrValue,
        this.state.photoFileName,
        this.state.ipfsUrl
      ).then(
        async (response) => {
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
              async (response) => {
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
                localStorage.removeItem('qrCodeT');
                localStorage.removeItem('allowClaim');

                let uno =
                  '-' +
                  '**Are you sharing this bottle with other people? How many?** ' +
                  `${this.state.answer1} `;
                let dos =
                  '-' +
                  '**Did you buy this bottle with crypto? or in a shop or restaurant? was it a gift?** ' +
                  `${this.state.answer2} `;
                let tres =
                  '-' +
                  '**Are you drinking this wine with food? What are you eating?** ' +
                  `${this.state.answer3} `;
                let cuatro =
                  '-' +
                  '**Do you like this wine? How would you rank it?** ' +
                  `${this.state.answer4} `;
                let cinco =
                  '-' +
                  '**Do you think we should build a colony on Mars?** ' +
                  `${this.state.answer5} `;
                let str = this.state.qrValue;
                let state = {
                  name: str.slice(0, str.length - 6),
                  description:
                    uno +
                    `\n\n` +
                    dos +
                    `\n\n` +
                    tres +
                    `\n\n` +
                    cuatro +
                    `\n\n` +
                    cinco,
                  image: this.state.photoFileName,
                };
                console.log(state);
                const toIPFS = JSON.stringify(state);
                this.setState({
                  ipfsUrl: toIPFS,
                });
                console.log(this.state.ipfsUrl);
                const file = this.state.ipfsUrl;
                try {
                  const added = await client.add(file);
                  const url = `https://ipfs.infura.io/ipfs/${added.path}`;
                  this.setState({
                    ipfsUrlJson: url,
                  });
                  console.log(this.state.ipfsUrlJson);
                  ExperienceService.updateJSON(
                    this.state.experienceId,
                    this.state.ipfsUrlJson
                  );
                  this.props.history.push('/app/user');
                } catch (error) {
                  console.log('Error uploading file: ', error);
                }
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
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    if (this.state.qRCodeClaim === true) {
      return (
        <Form
          onSubmit={this.handleSubmit}
          ref={(c) => {
            this.form = c;
          }}
        >
          <div className="col-md-12">
            <div className="card card-container login-form">
              <h1>{i18next.t('Add New Tasting')}</h1>
              <div className="form-group">
                <label className="cameraButton">
                  <i className="fas fa-camera-retro"></i>{' '}
                  {i18next.t('Take a picture')}
                  <Input
                    type="file"
                    onChange={this.onChangeFile}
                    accept="image/*;capture=camera"
                    validations={[required]}
                  />
                </label>
                {this.state.imgPlaceHolder && (
                  <img
                    alt="ipfs-url"
                    src={this.state.imgPlaceHolder}
                    width="370px"
                  />
                )}
                {this.state.loading && <LoadingSpinner />}
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  {i18next.t(
                    'Are you sharing this bottle with other people? How many?'
                  )}
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  name="answer1"
                  value={this.state.answer1}
                  onChange={this.handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  {i18next.t(
                    'Did you buy this bottle with crypto? or in a shop or restaurant? was it a gift?'
                  )}
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  name="answer2"
                  value={this.state.answer2}
                  onChange={this.handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  {i18next.t(
                    'Are you drinking this wine with food? What are you eating?'
                  )}
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  name="answer3"
                  value={this.state.answer3}
                  onChange={this.handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  {i18next.t('Do you like this wine? How would you rank it?')}
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  name="answer4"
                  value={this.state.answer4}
                  onChange={this.handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  {i18next.t('Do you think we should build a colony on Mars?')}
                </label>
                <TextArea
                  type="text"
                  className="form-control"
                  name="answer5"
                  value={this.state.answer5}
                  onChange={this.handleChange}
                  validations={[required]}
                />
              </div>
              <div className="form-group">
                <div className="form-group"></div>
                <button
                  className="btn btn-primary btn-block"
                  disabled={
                    this.state.photoFileName === loading || this.state.loading
                  }
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>{i18next.t('Register Tasting')}</span>
                </button>
              </div>

              {this.state.message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: 'none' }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </div>
          </div>
        </Form>
      );
    } else {
      return (
        <React.Fragment>
          <div className="col-md-12">
            <div className="card card-container login-form">
              <h1
                style={{
                  fontSize: '35px',
                  fontWeight: 'bold',
                  color: '#840c4a',
                  lineHeight: '33px',
                }}
              >
                {i18next.t('SCAN YOUR QR CODE')}
              </h1>
              <p
                style={{
                  marginTop: '20px',
                }}
              >
                {i18next.t(
                  'First, you have to scan the QR Code that is in the reverse of your wine bottle.'
                )}
              </p>
            </div>
          </div>
        </React.Fragment>
      );
    }
  }
}
export default withRouter(NewExperience);
