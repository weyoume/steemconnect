import React, { PropTypes } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Badge } from 'antd';
import PlatformAvatar from '../../../widgets/PlatformAvatar';
import './TransferDelegate.less';

const SignPlaceholderDefault = ({
  query,
}) => {
  let amount;
  let symbol;
  if (query.amount) {
    [amount, symbol] = query.amount.split(' ');
  }
  return (
    <div className="Placeholder__operation-content">
      <div className="TransferInfo">
        <div className="TransferInfo__accounts">
          <div className="TransferInfo__account">
            <PlatformAvatar username={query.fromName} size="60" className="TransferInfo__avatar" />
            {query.fromReputation && <span className="TransferInfo__reputation"><Badge className="badge" count={query.fromReputation} /></span>}
            <br />
            <span className="TransferInfo__username">
              {query.fromName || <FormattedMessage id="you" />}
            </span>
            <span className="TransferInfo__dots" />
          </div>
          <div className="TransferInfo__account">
            <span className="TransferInfo__dots" />
            <PlatformAvatar username={query.toName} size="60" className="TransferInfo__avatar" />
            {query.toReputation && <span className="TransferInfo__reputation"><Badge className="badge" count={query.toReputation} /></span>}
            <br />
            <span className="TransferInfo__username">
              {query.toName}
            </span>
          </div>
        </div>
        {amount &&
        <strong>
          <FormattedNumber
            value={amount}
            currency="USD"
            minimumFractionDigits={3}
            maximumFractionDigits={3}
          /> {symbol}
        </strong>}
        {query.memo && <span className="Placeholder__memo">{query.memo}</span>}
      </div>
    </div>
  );
};

SignPlaceholderDefault.propTypes = {
  query: PropTypes.shape(),
};

export default SignPlaceholderDefault;
