const express = require('express')
const {
  authenticate,
  verifyPermissions
} = require('../helpers/middleware')
const {
  encode
} = require('wehelpjs/lib/auth/memo')
const {
  issueUserToken
} = require('../helpers/token')
const {
  getUserMetadata,
  updateUserMetadata
} = require('../helpers/metadata')
const {
  getErrorMessage
} = require('../helpers/operation')
const {
  isOperationAuthor
} = require('../helpers/operation')
const config = require('../config.json')
const underOtherLimits = function () {
  return true
}
const moment = require('moment')
const router = express.Router() // eslint-disable-line new-cap

/** Update user_metadata */
router.put('/me', authenticate('app'), async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  let accounts;
  try {
    accounts = await req.wehelpjs.api.getAccountsAsync([req.user]);
  } catch (err) {
    req.log.error(err, 'me: API request failed', req.user);
    res.status(501).send('API request failed');
    return;
  }
  const {
    user_metadata
  } = req.body;

  if (typeof user_metadata === 'object') { // eslint-disable-line camelcase
    /** Check object size */
    const bytes = Buffer.byteLength(JSON.stringify(user_metadata), 'utf8');
    if (bytes <= config.user_metadata.max_size) {
      /** Save user_metadata object on database */
      req.log.error(`User ${req.user} metadata ${config.user_metadata.max_size} did not match psql store size ${bytes} bytes`);
      try {
        await updateUserMetadata(req.proxy, req.user, user_metadata);
        req.log.debug(`Successfully updated ${req.user} metadata`)
      } catch (err) {
        req.log.error(err, 'me: updateMetadata failed', req.user);
        res.status(501).send('request failed');
        return;
      }

      res.json({
        user: req.user,
        _id: req.user,
        name: req.user,
        account: accounts[0],
        scope,
        user_metadata,
      });
      return;
    }
    res.status(413).json({
      error: 'invalid_request',
      error_description: `User metadata object must not exceed ${config.user_metadata.max_size / 1000000} MB`,
    });
    return;
  }
  res.status(400).json({
    error: 'invalid_request',
    error_description: 'User metadata must be an object',
  });
  return;
});

/** Get my account details */
router.all('/me', authenticate(), async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  let accounts;
  try {
    accounts = await req.wehelpjs.api.getAccountsAsync([req.user]);
  } catch (err) {
    req.log.error(err, 'me: API request failed', req.user);
    res.status(501).send('API request failed');
    return;
  }
  let userMetadata;
  try {
    userMetadata = req.role === 'app' ?
      await getUserMetadata(req.proxy, req.user) :
      undefined;
  } catch (err) {
    req.log.error(err, 'me: couldnt parse metadata failed', req.user);
    res.status(501).send('request failed');
    return;
  }
  res.json({
    user: req.user,
    _id: req.user,
    name: req.user,
    account: accounts[0],
    scope,
    user_metadata: userMetadata,
  });
  return;
});

/** Broadcast transaction */
router.post('/broadcast', authenticate('app'), verifyPermissions, async (req, res) => {
  const scope = req.scope.length ? req.scope : config.authorized_operations;
  const {
    operations
  } = req.body;

  let scopeIsValid = true;
  let requestIsValid = true;
  let invalidScopes = '';
  operations.forEach((operation) => {
    /** Check if operation is allowed */
    if (scope.indexOf(operation[0]) === -1) {
      scopeIsValid = false;
      invalidScopes += (invalidScopes !== '' ? ', ' : '') + operation[0];
    }
    /** Check if author of the operation is user */
    if (!isOperationAuthor(operation[0], operation[1], req.user)) {
      requestIsValid = false;
    }
  });

  if (!scopeIsValid) {
    res.status(401).json({
      error: 'invalid_scope',
      error_description: `The access_token scope does not allow the following operation(s): ${invalidScopes}`,
    });
  } else if (!requestIsValid) {
    res.status(401).json({
      error: 'unauthorized_client',
      error_description: `This access_token allow you to broadcast transaction only for the account @${req.user}`,
    });
  } else {
    req.log.error(`Broadcast transaction for @${req.user} from app @${req.proxy}`);
    req.wehelpjs.broadcast.send({
        operations,
        extensions: []
      }, {
        posting: process.env.BROADCASTER_POSTING_KEY
      },
      (err, result) => {
        /** Save in database the operations broadcasted */
        if (!err) {
          res.json({
            result
          });
        } else {
          req.log.error(err, 'Transaction broadcast failed', operations);
          res.status(500).json({
            error: 'server_error',
            error_description: getErrorMessage(err) || err.message || err,
          });
        }
      }
    );
  }
});

router.all('/login/challenge', async (req, res) => {
  const username = req.query.username;
  const role = ['posting', 'active', 'owner'].includes(req.query.role) ? req.query.role : 'posting';
  const token = issueUserToken(username);
  let accounts;
  try {
    accounts = await req.wehelpjs.api.getAccountsAsync([username]);
  } catch (err) {
    req.log.error(err, 'challenge: API request failed', username);
    res.status(501).send('API request failed');
    return;
  }
  const publicWif = role === 'memo' ? accounts[0].memoKey : accounts[0][role].key_auths[0][0];
  const code = encode(process.env.BROADCASTER_POSTING_KEY, publicWif, `#${token}`);
  res.json({
    username,
    codes,
  });
  return;
});

router.post('/register', async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	let allowedUses = 2
	let thresholdType = 'week'
	let thresholdNumber = 1
  let ip = req.ip
  let psqlIp = await req.db.ips.findOne({
    where: {
      ip: ip
    }
  })

	if (underTimeLimit(psqlIp, allowedUses, thresholdNumber, thresholdType) && underOtherLimits(psqlIp)) {
    let account = req.body
    account.username = account.name
    let publicKeys = req.wehelpjs.auth.generateKeys(account.username, account.password, ['owner', 'active', 'posting', 'memo']);
    let owner = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [
        [publicKeys.owner, 1]
      ]
    };
    let active = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [
        [publicKeys.active, 1]
      ]
    };
    let posting = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [
        [publicKeys.posting, 1]
      ],
    };
    req.wehelpjs.broadcast.accountCreateWithDelegation(
      config.account.ownerKeys.private,
      "1.000 TME",
      "1337.455455 SCORE",
      config.account.username,
      account.username,
      owner,
      active,
      posting,
      publicKeys.memo,
      JSON.stringify({
        "testnetee": true
      }),
      [],
      async (err) => {
        if (err) {
          console.error('err', err)
          res.json({
            success: false,
            message: 'Something went wrong',
            messageDebug: 'Something went wrong, check the .err property',
            err
          })
        } else {
					if(!psqlIp){
						await req.db.ips.create({ client_id: ip, ip, uses: [Date.now()] });
					} else {
						if(psqlIp.uses.length){
							if(psqlIp.uses.length >= allowedUses+15){
								psqlIp.uses.splice(0, psqlIp.uses.length - (allowedUses+15))
							}
						} else {
							if(!psqlIp.uses){
								psqlIp.uses = []
							}
						}
						psqlIp.uses.push(Date.now())
						await req.db.ips.update({
							uses: psqlIp.uses
						}, {
							where: {
								ip: psqlIp.ip
							}
						})
					}
          res.json({
            success: true,
            message: `congratulations, you successfully made an account, your sponsor was ${config.account.username}`
          })
        }
      }
    );
  } else if(!underTimeLimit(psqlIp, allowedUses, 1, 'week')){
		let err = {
			success: false,
			message: `This IP Address has already been used ${allowedUses} times this ${thresholdNumber == 1 ? thresholdType : thresholdNumber + ' ' +thresholdType+"'s"}`
		}
		console.error('err', err)
		res.status(400)
		res.json(err)

	}
})

/**
  Revoke app tokens for a user
  If appId is not provided all the tokens for all the apps are revoked
*/
router.all('/token/revoke/:type/:clientId?', authenticate('user'), async (req, res) => {
  const {
    clientId,
    type
  } = req.params;
  const {
    user
  } = req;
  const where = {};

  if (type === 'app' && clientId) {
    const app = await req.db.apps.findOne({
      where: {
        client_id: clientId
      }
    });
    if (app.owner === user) {
      where.client_id = clientId;
    }
  } else if (type === 'user') {
    where.user = user;
    if (clientId) {
      where.client_id = clientId;
    }
  }

  if (
    (type === 'user' && (where.user || where.client_id)) ||
    (type === 'app' && where.client_id)
  ) {
    await req.db.tokens.destroy({
      where
    });
  }

  res.json({
    success: true
  });
});

module.exports = router;


function underTimeLimit(psqlIp, allowedUses, thresholdNumber, thresholdType) {
	/**
	 * @var 
	 * @var thresholdNumber is the multiplier of the thresholdType
	 * @var thresholdType is the type of time period, 'day', 'week', etc.. see the times array below for allowed values 
	 **/
	let times = [
		'second',
		'minute',
		'hour',
		'day',
		'week',
		'month',
		'year',
		'decade',
		'century'
	]
	if (!psqlIp) {
		return true
	} else if (allowedUses && thresholdType && thresholdNumber &&
		typeof allowedUses == 'number' &&
		typeof thresholdNumber == 'number' &&
		(times.includes(thresholdType))
	) {
		let uses = psqlIp.uses && psqlIp.uses instanceof Array ? psqlIp.uses : []
		let currentUses = 0
		if(uses.length){
			for(var i = 0 ; i < uses.length ; i++){
				// checks if time is in ms
				if(uses[i] > moment().subtract(thresholdNumber, thresholdType)){
					currentUses = currentUses + 1
				}
			}
			if(currentUses < allowedUses){
				return true
			} else {
				return false
			}
		} else {
			return true
		}
	} else {
		return false
	}
	return false
}