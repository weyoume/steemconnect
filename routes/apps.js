const express = require('express');
const crypto = require('crypto');
const has = require('lodash/has');
const { authenticate } = require('../helpers/middleware');
const config = require('../config.json');

const router = express.Router(); // eslint-disable-line new-cap

/** Get applications */
router.get('/', async (req, res) => {
  const apps = await req.db.apps.findAll({ where: { is_public: true }, attributes: { exclude: ['secret', 'allowed_ips'] } });
  res.json(apps);
});

/** Get my applications */
router.all('/me', authenticate('user'), async (req, res) => {
  const apps = await req.db.apps.findAll({ where: { owner: req.user } });
  res.json(apps);
});

/** Get application details */
router.get('/@:clientId', async (req, res, next) => {
  const { clientId } = req.params;
  const app = await req.db.apps.findOne({ where: { client_id: clientId }, attributes: { exclude: ['is_approved'] } });
  if (!app) {
    next();
  } else {
    if (!req.user || app.owner !== req.user) {
      app.secret = undefined;
      app.allowed_ips = undefined;
    }
    res.json(app);
  }
});

/** Create application */
router.post('/@:clientId', authenticate('user'), async (req, res) => {
  const { clientId } = req.params;

  const accounts = await req.wehelpjs.api.getAccountsAsync([clientId]);
  if (!accounts[0]) {
    res.status(400).json({ error: `Proxy account @${clientId} does not exist` });
  } else {
    const proxy = accounts[0];
    const proxyAuthStr = JSON.stringify({
      owner: proxy.owner,
      active: proxy.active,
      posting: proxy.posting,
      memo: proxy.memoKey,
    });
    const offlinePubKeys = config.offline_generated_public_keys;
    const requiredAuthStr = JSON.stringify({
      owner: { weight_threshold: 1, account_auths: [[config.account.name, 1]], key_auths: [[offlinePubKeys.owner, 1]] },
      active: { weight_threshold: 1, account_auths: [[config.account.name, 1]], key_auths: [[offlinePubKeys.active, 1]] },
      posting: { weight_threshold: 1, account_auths: [[config.account.name, 1]], key_auths: [[offlinePubKeys.posting, 1]] },
      memo: offlinePubKeys.memo,
    });

    let json;
    try {
      json = JSON.parse(proxy.json);
    } catch (e) {
      json = {};
    }

    if (
      proxyAuthStr === requiredAuthStr
      && json.owner && json.owner === req.user
    ) {
      const secret = crypto.randomBytes(24).toString('hex');
      req.db.apps.create({
        client_id: clientId,
        secret,
        owner: req.user,
      }).then(() => {
        res.json({ success: true });
      }).catch((err) => {
        const error = has(err, 'original.detail')
          ? err.original.detail
          : err;
        res.status(400).json({ error });
      });
    } else {
      res.status(400).json({ error: `Proxy account @${clientId} is not valid` });
    }
  }
});

/** Update application */
router.put('/@:clientId', authenticate('user'), async (req, res, next) => {
  const { clientId } = req.params;
  const app = req.body;
  try {
    await req.db.apps.update({
      redirect_uris: app.redirect_uris,
      name: app.name,
      description: app.description,
      icon: app.icon,
      website: app.website,
      is_public: app.is_public,
      allowed_ips: app.allowed_ips,
    }, {
      where: {
        client_id: clientId,
        owner: req.user,
      },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/** Reset client secret */
router.put('/@:clientId/reset-secret', authenticate('user'), async (req, res, next) => {
  const { clientId } = req.params;
  const secret = crypto.randomBytes(24).toString('hex');
  try {
    await req.db.apps.update({
      secret,
    }, {
      where: {
        client_id: clientId,
        owner: req.user,
      },
    });
    res.json({ success: true, secret });
  } catch (err) {
    next(err);
  }
});

router.all('/authorized', authenticate('user'), async (req, res) => {
  const accounts = await req.wehelpjs.api.getAccountsAsync([req.user]);
  const postingAccountAuths = accounts[0].posting.account_auths;
  const apps = await req.db.apps.findAll({
    where: {
      client_id: postingAccountAuths.map(accountAuth => accountAuth[0]),
    },
    attributes: { exclude: ['secret'] },
  });

  res.json({ apps });
});

module.exports = router;
