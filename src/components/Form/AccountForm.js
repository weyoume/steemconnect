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
      ezira: '0.000 ECO',
      ESCOR: '0.000000 ESCOR',
    };
    this.state = {
      data,
      valid: {},
    };
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
          <div className="form-group">
            <label className="label" htmlFor="ezira"><FormattedMessage id="ezira" /></label>
            <input
              id="ezira"
              type="text"
              className="form-control"
              name="ezira"
              onChange={this.onChange}
              defaultValue={data.ezira}
            />
            <small><FormattedMessage id="ezira_tip" /></small>
          </div>
          <div className="form-group">
            <label className="label" htmlFor="ESCOR"><FormattedMessage id="ESCOR" /></label>
            <input
              id="ESCOR"
              type="text"
              className="form-control"
              name="ESCOR"
              onChange={this.onChange}
              defaultValue={data.ESCOR}
            />
            <small><FormattedMessage id="ESCOR_tip" /></small>
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
