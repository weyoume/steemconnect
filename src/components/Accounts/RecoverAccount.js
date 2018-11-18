import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, notification } from 'antd';
import wehelpjs from 'wehelpjs';
import { Link } from 'react-router';
import RecoverAccountForm from '../Form/RecoverAccount';
import Loading from '../../widgets/Loading';
import { getErrorMessage } from '../../../helpers/operation';
import { createSuggestedPassword } from '../../utils/auth';

class RecoverAccount extends React.Component {
  state = {
    isLoading: false,
    values: {},
    fields: {
      new_password: {
        value: createSuggestedPassword(),
      },
    },
  };

  handleFormChange = (changedFields) => {
    this.setState({
      fields: { ...this.state.fields, ...changedFields },
    });
  };

  handleFormSubmit = async (values) => {
    const { intl } = this.props;
    this.setState({ values, isLoading: true });

    const onError = (error) => {
			console.error(error)
			console.error(getErrorMessage(error) || intl.formatMessage({ id: 'general_error' }))
      notification.error({
        message: intl.formatMessage({ id: 'error' }),
        description: getErrorMessage(error) || intl.formatMessage({ id: 'general_error' }),
      });
    };

    const onSuccess = () => {
      notification.success({
        message: intl.formatMessage({ id: 'success' }),
        description: intl.formatMessage({ id: 'account_recovered' }, { account: values.accountToRecover }),
      });
    };

    await this.recoverAccount(
      values.accountToRecover,
      values.old_password,
      values.new_password,
      onError,
      onSuccess);
    this.setState({ isLoading: false });
  };

  // https://github.com/WeYouMe/weauth/blob/0b3af70996c08423a770db2ef23189cd4e7d12be/app/redux/TransactionSaga.js#L481
  recoverAccount = async (accountToRecover, oldPassword, newPassword, onError, onSuccess) => {
    const oldOwnerPrivate = wehelpjs.auth.isWif(oldPassword) ? oldPassword :
      wehelpjs.auth.toWif(accountToRecover, oldPassword, 'owner');

    const oldOwner = wehelpjs.auth.wifToPublic(oldOwnerPrivate);

    const newOwnerPrivate = wehelpjs.auth.toWif(accountToRecover, newPassword.trim(), 'owner');
    const newOwner = wehelpjs.auth.wifToPublic(newOwnerPrivate);
    const pwPubkey = (name, pw, role) =>
      wehelpjs.auth.wifToPublic(wehelpjs.auth.toWif(name, pw.trim(), role));
    const newActive = pwPubkey(accountToRecover, newPassword.trim(), 'active');
    const newPosting = pwPubkey(accountToRecover, newPassword.trim(), 'posting');
    const newMemo = pwPubkey(accountToRecover, newPassword.trim(), 'memo');

    const newOwnerAuthority = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[newOwner, 1]],
    };

    const recentOwnerAuthority = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[oldOwner, 1]],
    };

    try {
      await wehelpjs.broadcast.sendAsync({ extensions: [],
        operations: [
          ['recover_account', {
            accountToRecover: accountToRecover,
            new_owner_authority: newOwnerAuthority,
            recent_owner_authority: recentOwnerAuthority,
          }],
        ] }, [oldOwnerPrivate, newOwnerPrivate]);

      // change password
      // change password probably requires a separate transaction (single trx has not been tested)
      await wehelpjs.broadcast.sendAsync({ extensions: [],
        operations: [
          ['accountUpdate', {
            account: accountToRecover,
            active: { weight_threshold: 1, account_auths: [], key_auths: [[newActive, 1]] },
            posting: { weight_threshold: 1, account_auths: [], key_auths: [[newPosting, 1]] },
            memoKey: newMemo,
            json: '',
          }],
        ] }, [newOwnerPrivate]);
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  render() {
    const { fields, isLoading } = this.state;
    return (
      <div className="container py-5">
        <Card>
          {isLoading && <div className="text-center my-4"><Loading /></div>}
          {!isLoading &&
            <div>
              <div className="text-center my-4">
                <h2><FormattedMessage id="recover_account" /></h2>
                <p><FormattedMessage id="require_account_recovery_text" values={{ link: <Link to="/accounts/request-recovery"><FormattedMessage id="require_account_recovery_link" /></Link> }} /></p>
              </div>
              <hr className="mb-5" />
              <RecoverAccountForm
                {...fields}
                onSubmit={this.handleFormSubmit}
                onChange={this.handleFormChange}
              />
            </div>
          }
        </Card>
      </div>
    );
  }
}

export default injectIntl(RecoverAccount);
