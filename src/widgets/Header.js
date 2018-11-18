import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { Menu, Dropdown } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PlatformAvatar from './PlatformAvatar';
import './Header.less';
import { logout, authenticate } from '../actions/auth';
import { getAccounts } from '../utils/localStorage';

@connect(
  state => ({
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    logout,
    authenticate,
  }, dispatch)
)
export default class Header extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    authenticate: PropTypes.func.isRequired,
    auth: PropTypes.shape({}).isRequired,
  };

  handleLogoutClick = () => {
    // eslint-disable-next-line no-shadow
    const { logout, username } = this.props;
    let accounts = getAccounts();
    if (accounts.length > 0) {
      accounts = accounts.filter(acc => acc.username !== username);
      localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    logout();
  };

  changeAccount = ({ key }) => {
    // eslint-disable-next-line no-shadow
    const { authenticate, username } = this.props;
    const accounts = getAccounts();
    if (key !== username && accounts.length > 0) {
      const account = accounts.find(acc => acc.username === key);
      localStorage.setItem('token', account.token);
      authenticate();
    }
  }

  render() {
    const { username, auth } = this.props;
    const accounts = getAccounts();
    let user = '';
    if (auth && auth.user && auth.user.json) {
      try {
        const metadata = JSON.parse(auth.user.json);
        if (metadata && metadata.profile && metadata.profile.name) {
          user = metadata.profile.name;
        } else {
          user = username;
        }
      } catch (e) {
        // Do nothing
      }
    }
    return (
      <div className="Header container">
				<div className="nav-link">
					<Link to="/"><FormattedMessage id="Home" />
					</Link>
				</div>
				<div className="nav-link">
					<Link to="/me"><FormattedMessage id="me" />
					</Link>
				</div>
				<div className="nav-link">
					<Link to="/apps/me"><FormattedMessage id="my_apps" />
					</Link>
				</div>

        <div className="Header__log">
          {username &&
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            overlay={
              <Menu className="switch-account-menu" onClick={this.changeAccount}>

                <Menu.Item key="switch-account-active" className="active">
                  <PlatformAvatar username={username} size="72" />
                  <div className="account-information">
                    <span className="account-name">{username}</span>
                    <span className="username">@{username}</span>
                    <Link onClick={this.handleLogoutClick} className="logout">
                      <FormattedMessage id="log_out" />
                    </Link>
                  </div>
                </Menu.Item>
                {accounts.filter(account => account.username !== username).map(account =>
                  <Menu.Item key={account.username}>
                    <PlatformAvatar username={account.username} size="36" />
										<br></br>
										<span className="account-name">{account.username}</span>
                  </Menu.Item>
                )}
                <Menu.Item key="switch-account-actions" className="actions" disabled>
                  <Link to="/login">
                    <FormattedMessage id="use_another_account" />
                  </Link>
                </Menu.Item>
              </Menu>
            }
          >
            <a className="ant-dropdown-link" href={undefined}>
              <span className="account-name">{username}</span>
							<br></br>
							<PlatformAvatar username={username} />
            </a>
          </Dropdown>
          }
          {!username &&
          <div>
            <Link to="/login"><FormattedMessage id="log_in" /></Link>
          </div>
          }
        </div>
      </div>
    );
  }
}
