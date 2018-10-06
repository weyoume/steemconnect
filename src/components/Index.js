import React, { PropTypes } from 'react';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Popover, Icon } from 'antd';
import * as actions from '../actions/appLocale';
import locales from '../../helpers/locales.json';
import './Index.less';

const LanguageItem = ({ setLocale, locale }) => (
  <li>
    <button onClick={() => setLocale(locale)}>
      {locales[locale]}
    </button>
  </li>
);
LanguageItem.propTypes = {
  setLocale: PropTypes.func,
  locale: PropTypes.string,
};

@connect(
  state => ({
    locale: state.appLocale.locale,
  }),
  dispatch =>
    bindActionCreators(
      {
        setLocale: actions.setLocale,
      },
      dispatch,
    ),
)
class Index extends React.Component {
  static propTypes = {
    form: PropTypes.shape(),
    intl: intlShape.isRequired,
    setLocale: PropTypes.func,
    locale: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form: { getFieldDecorator }, setLocale, locale, intl } = this.props;
    return (
      <div>
        <div id="header">
          <img src="/img/macbook.png" id="macbook-img" alt="macbook" />
					<object data="img/hero.svg" type="image/svg+xml" id="header-bg" />
          <div className="lp-container">
            <div id="menu">
              <div className="menu-item logo">
                {/* <object data="img/logo-white.svg" type="image/svg+xml" /> */}
								<div className="nav-title">
									Me
								</div>
              </div>
              <div className="menu-item horizontal">
                <Popover
                  placement="bottom"
                  content={
                    <ul className="lp-language-select">
                      <LanguageItem locale="en" setLocale={setLocale} />
                      <LanguageItem locale="fr" setLocale={setLocale} />
                      <LanguageItem locale="ru" setLocale={setLocale} />
                      <LanguageItem locale="ko" setLocale={setLocale} />
                      <LanguageItem locale="zh" setLocale={setLocale} />
                    </ul>
                  }
                  trigger="click"
                >
                  <Button className="language-btn">{locales[locale]}<Icon type="down" /></Button>
                </Popover>
								<div className="nav-button">
									<a href="/login" rel="noopener noreferrer" className="login-btn pw-btn pcd-text lp-link ant-btn-lg">
										<FormattedMessage id="login" />
									</a>
								</div>
								<div className="nav-button">
									<a href="/register" rel="noopener noreferrer" className="login-btn pw-btn pcd-text lp-link ant-btn-lg">
										<FormattedMessage id="register" />
									</a>
								</div>
								<div className="nav-button">
									<a href="/me" rel="noopener noreferrer" className="login-btn pw-btn pcd-text lp-link ant-btn-lg">
										<FormattedMessage id="me" />
									</a>
								</div>
              </div>
            </div>
            <div className="hero">
              <h1 className="title"><FormattedMessage id="lp_hero_title" /></h1>
              <p className="sub-title"><FormattedMessage id="lp_hero_description" /></p>
              <div className="newsletter">
                <Form
                  onSubmit={() => {}}
                  action=""
                  method="post"
                  name="mc-embedded-subscribe-form"
                  target="_blank"
                  className="ant-form ant-form-inline"
                  layout="inline"
                >
                  <Form.Item hasFeedback>
                    <input type="hidden" name="b_c8daffe293678b527521abf65_0a6cefe541" />
                    {getFieldDecorator('email', {
                      rules: [
                        { type: 'email', message: intl.formatMessage({ id: 'error_invalid_email' }) },
                        { required: true, message: intl.formatMessage({ id: 'error_empty_email' }) },
                      ],
                      className: 'hero_form_item',
                    })(
                      <Input name="EMAIL" placeholder={intl.formatMessage({ id: 'email_address' })} />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" name="subscribe" htmlType="submit" className="pcd2-btn lp-link">
                      <FormattedMessage id="subscribe" />
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-container how-it-works">
          <span className="small-title">
            <FormattedMessage id="lp_section_1_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_1_title" /></h3>
        </div>

        <div className="protocol-features-container">
          <div className="lp-container protocol-features">
            <div className="protocol-feature">
              <object data="img/apps.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_1_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_1_description" />
              </p>
            </div>
            <div className="protocol-feature">
              <object data="img/account.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_2_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_2_description" />
              </p>
            </div>
            <div className="protocol-feature">
              <object data="img/wallet.svg" type="image/svg+xml" />
              <strong className="feature-title">
                <FormattedMessage id="lp_feature_3_title" />
              </strong>
              <p className="feature-desc">
                <FormattedMessage id="lp_feature_3_description" />
              </p>
            </div>
          </div>
        </div>

        <div className="safe-secure-container">
          <div className="lp-container safe-secure">
            <div>
              <object data="img/lock.svg" type="image/svg+xml" />
            </div>
            <div>
              <span className="small-title">
                <FormattedMessage id="lp_section_2_tag" />
              </span>
              <h3><FormattedMessage id="lp_section_2_title" /></h3>
              <p><FormattedMessage id="lp_section_2_description" /></p>
            </div>
          </div>
        </div>

        <div className="lp-container learn-more">
          <span className="small-title">
            <FormattedMessage id="lp_section_3_tag" />
          </span>
          <h3><FormattedMessage id="lp_section_3_title" /></h3>
        </div>

        <div className="lp-container project">
          <div className="project-item">
            <object data="img/opensource.svg" type="image/svg+xml" />
            <div className="project-content">
              <h4 className="project-title"><FormattedMessage id="lp_opensource_title" /></h4>
              <p><FormattedMessage id="lp_opensource_description" /></p>
              <a href="https://github.com/WeYouMe" target="_blank" rel="noreferrer noopener" className="lp-link gh">
                <FormattedMessage id="lp_opensource_button" />
              </a>
              {/* <a href="https://github.com/WeYouMe/weauth" target="_blank" rel="noreferrer noopener" className="lp-link gh">
                <FormattedMessage id="WeAuth Github" />
              </a> */}
            </div>
          </div>
          <div className="project-item">
            <object data="img/code.svg" type="image/svg+xml" />
            <div>
              <h4 className="project-title"><FormattedMessage id="lp_developers_title" /></h4>
              <p><FormattedMessage id="lp_developers_description" /></p>
              <a href="https://auth.weyoume.src/console" rel="noopener noreferrer" className="lp-link">
                <FormattedMessage id="lp_developers_button" />
              </a>
            </div>
          </div>
        </div>

        <div className="get-started-container">
          <div className="lp-container get-started">
            <div>
              <h2><FormattedMessage id="lp_subscribe_title" /></h2>
              <p><FormattedMessage id="lp_subscribe_description" /></p>
            </div>
            <div>
              <a href="#header" rel="noopener noreferrer" className="lp-link">
                <FormattedMessage id="lp_subscribe_button" />
              </a>
            </div>
          </div>
        </div>

        <div className="lp-container footer-menu">
          <ul>
            <li><FormattedMessage id="lp_footer" /></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Form.create()(
  injectIntl(Index)
);
