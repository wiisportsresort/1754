const crypto = require('crypto');
const { writeJSONToFile } = require('./util');

const getHashedPassword = password => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
};

const generateAuthToken = () => crypto.randomBytes(30).toString('hex');

const requireAuth = loginFile => {
  return (req, res, next) => {
    if (req.header('pipedream') === 'true') {
      // console.log('pipedream: request was accepted');
      next();
    }

    if (req.user) {
      console.log('express: user connected with auth token ' + JSON.stringify(req.user));
      next();
    } else {
      // console.log('express: unauthorized user connected, redirecting to login page');
      res.sendFile(__dirname + '/' + loginFile);
    }
  };
};

const injectAuthToken = authTokens => {
  return (req, res, next) => {
    const authToken = req.cookies.AuthToken;
    // Inject the user to the request
    req.user = authTokens[authToken];
    next();
  };
};

const handleLogin = (users, authTokensFile, authTokensFilePath) => {
  return (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    console.log('new login attempt:\n  username: ' + username + '\n  password: ' + password);

    const user = users.find(u => {
      return u.username === username && hashedPassword === u.password;
    });

    if (user) {
      const authToken = generateAuthToken();

      // Store authentication token
      authTokensFile.authTokens[authToken] = user;
      writeJSONToFile(authTokensFile, authTokensFilePath);

      // Setting the auth token in cookies
      res.cookie('AuthToken', authToken);
    }

    res.redirect('/');
  };
};

module.exports = {
  getHashedPassword,
  generateAuthToken,
  requireAuth,
  injectAuthToken,
  handleLogin
};
