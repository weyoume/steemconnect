import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from '../../widgets/Form';
import { createSuggestedPassword } from '../../utils/auth';
import { accountNotExist, validateAccountName } from '../../utils/validator';

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
		let passwordVisibility = false
    this.state = {
			passwordVisibility,
      data,
			valid: {},
			details: false,
			errors: [],
			passwordError: ''
    };
  }

	toggleDetails = (data) => {
		this.setState({
			details: !this.state.details
		})
	}
	togglePasswordVisibility = (data) => {
		this.setState({
			passwordVisibility: !this.state.passwordVisibility
		})
	}
	toggleCustomSignatory = () => {
		this.props.changeSignatoryOption(!this.props.customSignatory)
	}
	clearError = (error) => {
		let errors = this.state.errors
		// if(errors.splice){
		// 	errors.splice(i, 1)
		// 	this.setState({
		// 		errors
		// 	})
		// }
		if(error == 'passwordMatch'){
			let checked = false
			this.setState({
				checked
			})
			this.setState({
				passwordError: ''
			})
		}
		if(error == 'usernameTaken'){
			// let data = this.state.data
			// data.name = ''
			this.setState({
				usernameTaken: '',
				// data
			})
		}
	}
	componentDidUpdate = (prevProps, prevState) => {
		/**
		 * @var TODO add a timeout to password match check so it doesn't show while typing 
		 */
		if(this.state.data.name && this.state.lastUsernameChecked !== this.state.data.name){
			this.setState({
				lastUsernameChecked: this.state.data.name
			})
			accountNotExist('', this.state.data.name, err => {
				if(err){
					console.error('err', err)
					this.setState({
						usernameTaken: (
							<div className={''}>
								<div className="error-msg">{'Username is taken, sorry'}</div>
								<div className="positive-msg pointer" onClick={() => this.clearError('usernameTaken')}>{'Thanks'}</div>
							</div>
						)
					})
				} else {
					this.setState({
						usernameTaken: false
					})
				}
			})
		}
		let passwordValid = this.state.data.password && this.state.data.confirmPassword && this.state.data.password == this.state.data.confirmPassword
		if(passwordValid && this.state.passwordError != ''){
			let checked = true
			this.setState({
				checked,
				passwordError: ''
			})
		} else if(this.state.data.password && this.state.data.confirmPassword && (this.state.lastPasswordChecked !== this.state.data.password || this.state.lastConfirmPasswordChecked !== this.state.data.confirmPassword)) {
			let error = {
				error: "Passwords don't match",
				message: "Your entered passwords don't match"
			}
			console.error(error.message, error)
			// this.setState({
			// 	errors: [
			// 		error
			// 	]
			// })
			let checked = true
			this.setState({
				checked,
				lastConfirmPasswordChecked: this.state.data.confirmPassword,
				lastPasswordChecked: this.state.data.password
			})
			this.setState({
				passwordError: checked && this.state.data.password && this.state.data.confirmPassword && this.state.data.password != this.state.data.confirmPassword ? (
					<div className={''}>
						<div className="error-msg">{'Your passwords do not match'}</div>
						<div className="positive-msg pointer" onClick={() => this.clearError('passwordMatch')}>{'Thanks'}</div>
					</div>
				) : ''
			})
		}

	}
	preSubmit = (e) => {
		if(!this.state.passwordError && !this.state.usernameTaken){
			this.onSubmit(e)
		}
	}

  render() {
		const { data, passwordVisibility, errors, checked, passwordError, usernameTaken } = this.state;
		const { customSignatory } = this.props;
		// let errorsComponent = this.state.errors.map((error, i)=>{
		// 		<div>
		// 			{/* <div className="show-details-text" onClick={this.clearError(i)}> */}
		// 			<div className="show-details-text">
		// 				<div>{'Clear'}</div>
		// 			</div>
		// 			<div>{error.message}</div>
		// 		</div>
		// })
		console.log('data', data)
    return (
      <form onSubmit={this.preSubmit}>
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
						{ usernameTaken }
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password"><FormattedMessage id="password" /></label>
            <input
              id="password"
              type={!passwordVisibility ? 'password' : 'showPassword'}
              className="form-control"
							name="password"
							autoComplete="on"
              onChange={this.onChange}
              defaultValue={data.password}
            />
						<div className="show-details-text" onClick={this.togglePasswordVisibility}>
							<div>{!passwordVisibility ? 'Show Passwords' : 'Hide Passwords'}</div>
						</div>
						{/* <small><FormattedMessage id="password_tip" /></small> */}
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password"><FormattedMessage id="confirm_password" /></label>
            <input
              id="confirmPassword"
              type={!passwordVisibility ? 'password' : 'showPassword'}
              className="form-control"
							name="confirmPassword"
							autoComplete="on"
              onChange={this.onChange}
              defaultValue={data.confirmPassword}
            />
						<div className="show-details-text" onClick={this.togglePasswordVisibility}>
							<div>{!passwordVisibility ? 'Show Passwords' : 'Hide Passwords'}</div>
						</div>
            <small><FormattedMessage id="password_tip" /></small>
          </div>
					{passwordError}
					{/* {errorsComponent} */}
					{/* {errors[0] ? 
						<div>
							<div className="show-details-text" onClick={this.clearError(0)}>
								<div>{'Clear'}</div>
							</div>
							<div>{errors[0].message}</div>
						</div>
						: ''
					} */}
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
						<div>
							<div>{ customSignatory ? 'Using Custom Signatory' : 'Using Network Signatory'}</div>
							<div className="show-details-text" onClick={this.toggleCustomSignatory}>
								<div>{ customSignatory ? 'Use Network Signatory' : 'Use Custom Signatory'}</div>
							</div>
						</div>
					</div>
					<div className="show-details-text" onClick={this.toggleDetails}>
						<div>{this.state.details ? 'hide details' : 'show details'}</div>
					</div>
        </div>
        <div className="form-group py-3 text-center">
				{/* type="submit" */}
          <button
						type="button"
						onClick={this.preSubmit}
            className="btn btn-success"
            disabled={this.props.isLoading}
          >
            <FormattedMessage id="create" />
          </button>
        </div>
      </form>
    );
  }
}
