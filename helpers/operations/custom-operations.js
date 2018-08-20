module.exports = [
  {
    operation: 'follow',
    type: 'customJson',
    params: ['follower', 'following'],
  },
  {
    operation: 'unfollow',
    type: 'customJson',
    params: ['follower', 'following'],
  },
  {
    operation: 'reblog',
    type: 'customJson',
    params: ['author', 'permlink'],
  },
  {
    operation: 'mute',
    type: 'customJson',
    params: ['follower', 'following'],
  },
  {
    operation: 'unmute',
    type: 'customJson',
    params: ['follower', 'following'],
  },
  {
    operation: 'undelegateESCOR',
    type: 'delegateESCOR',
    params: ['delegator', 'delegatee'],
  },
  {
    operation: 'profile_update',
    type: 'accountUpdate',
    params: ['account'],
  },
];
