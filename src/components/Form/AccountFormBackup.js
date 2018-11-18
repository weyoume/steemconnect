import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from '../../widgets/Form';
import { createSuggestedPassword } from '../../utils/auth';

export default class AccountForm extends Form {
  constructor(props) {
    super(props);
		// const password = createSuggestedPassword();
		const password = ''
		const confirmPassword = password
    const data = this.props.data || {
			password,
			confirmPassword,
      TME: '1.000 TME',
      SCORE: '100.000000 SCORE',
		};
		let passwordCheck = true
    this.state = {
			passwordCheck,
      data,
			valid: {},
			details: false,
			errors: []
    };
  }

	toggleDetails = (data) => {
		this.setState({
			details: !this.state.details
		})
	}
	togglePassword = (data) => {
		this.setState({
			passwordCheck: !this.state.passwordCheck
		})
		console.log('this.state.details', this.state.details)
	}
	preSubmit = (data) => {
		if(data.password == data.confirmPassword){
			this.onSubmit()
		} else {
			this.setState({
				errors: [
					{
						error: "Passwords don't match",
						message: "The passwords don't match"
					}
				]
			})
		}
	}

  render() {
		const { data, passwordCheck, errors } = this.state;
		console.log('data', data)
    return (
      <form onSubmit={this.onSubmit}>
        <div className="block">
          <div className={this.getClasses('name', 'form-group')}>
            <label className="label" htmlFor="username"><FormattedMessage id="username" /></label>
            <input
              id="username"
              type="text"
              className="form-control"
              name="name"
							data-validator="isNotUsername"
							autoComplete="on"
              onChange={this.onChange}
              defaultValue={data.name}
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password"><FormattedMessage id="password" /></label>
            <input
              id="password"
              type={passwordCheck ? 'password' : 'showPassword'}
              className="form-control"
							name="password"
							autoComplete="on"
              onChange={this.onChange}
              defaultValue={data.password}
            />
						<div className="show-details-text" onClick={this.togglePassword}>
							<div>{passwordCheck ? 'Show Password' : 'Hide Password'}</div>
						</div>
						{/* <small><FormattedMessage id="password_tip" /></small> */}
          </div>
          {/* <div className="form-group">
            <label className="label" htmlFor="password"><FormattedMessage id="confirm_password" /></label>
            <input
              id="confirmPassword"
              type={passwordCheck ? 'password' : 'showPassword'}
              className="form-control"
							name="confirmPassword"
							autoComplete="on"
              onChange={this.onChange}
              defaultValue={data.confirmPassword}
            />
						<div className="show-details-text" onClick={this.togglePassword}>
							<div>{passwordCheck ? 'Show Password' : 'Hide Password'}</div>
						</div>
            <small><FormattedMessage id="password_tip" /></small>
          </div> */}
					<div className={this.state.details ? 'visible' : '' + " extra-details"}>
						<div className="form-group">
							<label className="label" htmlFor="TME"><FormattedMessage id="TME" /></label>
							<input
								id="TME"
								type="text"
								className="form-control"
								name="TME"
								onChange={this.onChange}
								defaultValue={data.TME}
							/>
							<small><FormattedMessage id="protocol_tip" /></small>
						</div>
						<div className="form-group">
							<label className="label" htmlFor="SCORE"><FormattedMessage id="SCORE" /></label>
							<input
								id="SCORE"
								type="text"
								className="form-control"
								name="SCORE"
								onChange={this.onChange}
								defaultValue={data.SCORE}
							/>
							<small><FormattedMessage id="SCORE_tip" /></small>
						</div>
					</div>
					{errors.map(function(error, i){
						return 
						<div>
							<div className="show-details-text" onClick={this.toggleDetails}>
								<div>{'Clear'}</div>
							</div>
							<div>{error.message}</div>
						</div>
					})}
					<div className="show-details-text" onClick={this.toggleDetails}>
						<div>{this.state.details ? 'hide details' : 'show details'}</div>
					</div>
        </div>
        <div className="form-group py-3 text-center">
          <button
						type="submit"
            className="btn btn-success"
            disabled={this.props.isLoading}
          >
            <FormattedMessage id="continue" />
          </button>
        </div>
      </form>
    );
  }
}
