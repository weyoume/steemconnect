import React, { PropTypes } from 'react';
import './PlatformAvatar.less';

const PlatformAvatar = ({
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
      className={`PlatformAvatar ${className}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url(https://steemitimages.com/u/${username}/avatar)`,
      }}
    />
  </span>
;

PlatformAvatar.propTypes = {
  username: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default PlatformAvatar;
