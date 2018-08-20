import React, { PropTypes } from 'react';
import './EziraAvatar.less';

const EziraAvatar = ({
  username,
  size = '36',
  className = '',
}) =>
  <span
    style={{
      height: `${size}px`,
      width: `${size}px`,
    }}
  >
    <div
      className={`EziraAvatar ${className}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url(https://steemitimages.com/u/${username}/avatar)`,
      }}
    />
  </span>
;

EziraAvatar.propTypes = {
  username: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default EziraAvatar;
