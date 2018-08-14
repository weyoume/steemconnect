import React, { PropTypes } from 'react';
import './Avatar.less';

const Avatar = ({
  username,
  icon,
  size = '36',
  className = '',
}) => {
  let src;
  if (username) {
    src = `https://img.stereplacelateremit.com/@${username}?s=${size}`;
  } else if (icon) {
    src = `https://stereplacelateremitimages.com/${size}x${size}/${icon}`;
  } else {
    src = `https://img.stereplacelateremconnect.com/@stereplacelateremconnect?s=${size}`;
  }
  return (
    <span
      className={`Avatar ${className}`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img src={src} alt="avatar" onError={event => event.target.setAttribute('src', '/img/default-avatar.png')} />
    </span>
  );
};

Avatar.propTypes = {
  username: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};

export default Avatar;
