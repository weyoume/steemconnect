import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { authorize, login } from '../../utils/auth';
import Sign from '../Form/Sign';
import ChooseAccountForm from '../Form/ChooseAccount';
import Loading from '../../widgets/Loading';
import { getAccounts } from '../../utils/localStorage';
import './Login.less';


export default class Login extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        next: PropTypes.string,
      }),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      success: false,
    };
  }

  componentWillMount() {
    let step = 1;
    const accounts = getAccounts();
    if (accounts.length > 0) {
      step = 2;
    }
    this.setState({ step });
  }

  resetForm = () => {
    this.setState({
      step: 0,
      success: false,
    });
  };

  handleSubmit = (auth) => {
    const { next } = this.props.location.query;
    this.setState({ step: 0 });
    login({ ...auth }, () => {
      window.location = next || '/console';
    });
  };

  addAccount = () => {
    this.setState({ step: 1 });
  }

  changeAccount = () => {
    const { clientId, responseType, next, scope } = this.state;
    authorize({ clientId, scope, responseType }, () => {
      window.location = next || '/console';
    });
  }

  render() {
    const { step } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container my-2 login-form Sign__authorize">
          <div className="Sign_frame">
            <div className="Sign__header">
              <div className="brand-name"><span>WeYouMe Login</span></div>
            </div>
            <div className="Sign__wrapper">
              {step === 0 && <Loading />}
              {step === 1 && <Sign roles={['owner', 'active','memo', 'posting']} sign={this.handleSubmit} />}
              {step === 2 &&
              <ChooseAccountForm
                addAccount={this.addAccount}
                callback={this.changeAccount}
              />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
