const profileUpdate = require('./profile-update');
const comment = require('./comment');
const customJson = require('./custom-json');
const delegateSCORE = require('./delegate-SCORE');
const escrowApprove = require('./escrow-approve');
const escrowDispute = require('./escrow-dispute');
const escrowRelease = require('./escrow-release');
const escrowTransfer = require('./escrow-transfer');
const follow = require('./follow');
const mute = require('./mute');
const reblog = require('./reblog');
const setWithdrawSCOREasTMEroute = require('./set-withdraw-SCORE-route');
const transfer = require('./transfer');
const undelegateSCORE = require('./undelegate-SCORE');
const unfollow = require('./unfollow');
const unmute = require('./unmute');
const vote = require('./vote');

module.exports = {
  comment,
  customJson: customJson,
  delegateSCORE: delegateSCORE,
  escrow_approve: escrowApprove,
  escrow_dispute: escrowDispute,
  escrow_release: escrowRelease,
  escrow_transfer: escrowTransfer,
  follow,
  mute,
  reblog,
  setWithdrawSCOREasTMEroute: setWithdrawSCOREasTMEroute,
  transfer,
  undelegateSCORE: undelegateSCORE,
  unfollow,
  unmute,
  profile_update: profileUpdate,
  vote,
};
