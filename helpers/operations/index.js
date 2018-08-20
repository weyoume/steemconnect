const profileUpdate = require('./profile-update');
const comment = require('./comment');
const customJson = require('./custom-json');
const delegateESCOR = require('./delegate-eScore');
const escrowApprove = require('./escrow-approve');
const escrowDispute = require('./escrow-dispute');
const escrowRelease = require('./escrow-release');
const escrowTransfer = require('./escrow-transfer');
const follow = require('./follow');
const mute = require('./mute');
const reblog = require('./reblog');
const setWithdrawESCORasECOroute = require('./set-withdraw-eScore-route');
const transfer = require('./transfer');
const undelegateESCOR = require('./undelegate-eScore');
const unfollow = require('./unfollow');
const unmute = require('./unmute');
const vote = require('./vote');

module.exports = {
  comment,
  customJson: customJson,
  delegateESCOR: delegateESCOR,
  escrow_approve: escrowApprove,
  escrow_dispute: escrowDispute,
  escrow_release: escrowRelease,
  escrow_transfer: escrowTransfer,
  follow,
  mute,
  reblog,
  setWithdrawESCORasECOroute: setWithdrawESCORasECOroute,
  transfer,
  undelegateESCOR: undelegateESCOR,
  unfollow,
  unmute,
  profile_update: profileUpdate,
  vote,
};
