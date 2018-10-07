import React, { Component } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import wehelpjs from 'wehelpjs';
import { notification } from 'antd';
import AccountForm from '../Form/AccountForm';
import SignForm from '../Form/Sign';
import Loading from '../../widgets/Loading';
import { getErrorMessage } from '../../../helpers/operation';
import { browserHistory } from 'react-router';
import fetch from 'isomorphic-fetch';

class CreateAccount extends Component {
  static propTypes = {
		intl: intlShape.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      error: false,
			account: {},
			options: {
				customSignatory: false
			}
    };
  }

  submit = (data) => {
		let account = data
    this.setState({
      step: 1,
      account: account
		});
		const { intl } = this.props;
		if(!this.state.options.customSignatory){
			// $.ajax({
			// 	type: 'POST',
			// 	url: 'https://auth.weyoume.io/api/register',
			// 	data
			// }).done(res=>{
			// 	console.log('res', res)
			// })
			fetch(`/api/register`, {
        method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': "application/json"
				}
      })
			.then((res) => {
				this.setState({
					step: 0,
				})		
				res.json()
				.then(res=>{
					if (res.success) {
						notification.success({
							message: intl.formatMessage({ id: 'success' }),
							description: intl.formatMessage({ id: 'success_accountCreate' }, { account: account.name }),
						});
						browserHistory.push('/console')
					} else {
						if(res.err){
							console.error('res.err', res.err)
							notification.error({
								message: intl.formatMessage({ id: 'error' }),
								description: res.message || intl.formatMessage({ id: 'general_error' }),
							});
						} else {
							notification.error({
								message: intl.formatMessage({ id: 'error' }),
								description: res.message || intl.formatMessage({ id: 'general_error' }),
							});
	
						}
						// browserHistory.push('/@'+account.name+'/console')
					}
				})
			})
			.catch((err) => {
				console.error('err', err)
				// dispatch(authenticateFailure());
			});
		}
  };
	changeSignatoryOption = (data) => {
		this.setState({
			options: {
				customSignatory: data
			}
		})
	}
  sign = (auth) => {
    const { account } = this.state;
    const { intl } = this.props;
    const publicKeys = wehelpjs.auth.generateKeys(account.name, account.password, ['owner', 'active', 'posting', 'memo']);
    const owner = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.owner, 1]] };
    const active = { weight_threshold: 1, account_auths: [], key_auths: [[publicKeys.active, 1]] };
    const posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[publicKeys.posting, 1]],
    };
    wehelpjs.broadcast.accountCreateWithDelegation(
      auth.wif,
      account.TME,
      account.SCORE,
      auth.username,
      account.name,
      owner,
      active,
      posting,
      publicKeys.memo,
      JSON.stringify({}),
      [],
      (err) => {
        this.setState({ step: 0 });
        if (err) {
					console.error(err)
					console.error(getErrorMessage(err) || intl.formatMessage({ id: 'general_error' }))		
          notification.error({
            message: intl.formatMessage({ id: 'error' }),
            description: getErrorMessage(err) || intl.formatMessage({ id: 'general_error' }),
          });
        } else {
          notification.success({
            message: intl.formatMessage({ id: 'success' }),
            description: intl.formatMessage({ id: 'success_accountCreate' }, { account: account.name }),
					});
					// browserHistory.push('/@'+account.name+'/console')
					browserHistory.push('/console')
        }
      }
    );
    this.setState({ step: 2 });
  };

  render() {
    const { step, options } = this.state;
    return (
      <div className="Sign">
        <div className="Sign__content container text-left my-2 Sign__authorize">
          {step === 0 &&
            <div>
              <h2 className="text-center"><FormattedMessage id="create_account" /></h2>
							<AccountForm 
								customSignatory={options.customSignatory} 
								changeSignatoryOption={this.changeSignatoryOption} 
								submit={this.submit} 
							/>
            </div>
          }
          {step === 1 && options.customSignatory &&
            <div className="text-center">
              <SignForm roles={['owner','active']} sign={this.sign} />
            </div>
					}
					{step === 1 && !options.customSignatory &&
            <div className="text-center">
							{'Registering... Please wait'}
							<br></br>
							<Loading />
              {/* <SignForm roles={['owner','active']} sign={this.sign} /> */}
            </div>
          }
          {step === 2 &&
            <div className="text-center">
              <Loading />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default injectIntl(CreateAccount);
