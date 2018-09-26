import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from '../../widgets/Form';
import { createSuggestedPassword } from '../../utils/auth';

export default class AccountForm extends Form {
  constructor(props) {
    super(props);
    const password = createSuggestedPassword();
    const data = this.props.data || {
      password,
      TME: '1.000 TME',
      SCORE: '100.000000 SCORE',
    };
    this.state = {
      data,
			valid: {},
			details: false
    };
  }

	toggleDetails = (data) => {
		this.setState({
			details: !this.state.details
		})
		console.log('this.state.details', this.state.details)
	}

  render() {
    const { data } = this.state;
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
              onChange={this.onChange}
              defaultValue={data.name}
              maxLength="16"
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="password"><FormattedMessage id="password" /></label>
            <input
              id="password"
              type="text"
              className="form-control"
              name="password"
              onChange={this.onChange}
              defaultValue={data.password}
            />
            <small><FormattedMessage id="password_tip" /></small>
          </div>
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
