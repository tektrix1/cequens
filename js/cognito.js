// Configure AWS Cognito
AWS.config.region = 'us-east-1'; // Set your AWS region

const poolData = {
    UserPoolId: 'us-east-1_koleu63QR',
    ClientId: '349jd6d61526t6j8vqd9cio2k3'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function authenticateUser(username, password, callback) {
    const authenticationData = {
        Username: username,
        Password: password
    };

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    // Calculate SECRET_HASH
    const clientId = '349jd6d61526t6j8vqd9cio2k3';
    const clientSecret = '1ot3qpssnlcn3rh8p7ak3jfjcadqbrrd8kv0g2b2nv6bppgc6rhs';


    const hasher = createHmac('sha256', clientSecret);
  // AWS wants `"Username" + "Client Id"`
    hasher.update(`${username}${clientId}`);
  const secretHash = hasher.digest('base64');

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            const accessToken = result.getAccessToken().getJwtToken();
            callback(null, accessToken); // Pass accessToken to the callback
        },
        onFailure: function (err) {
            console.error('Failed to authenticate user:', err);
            callback(err); // Pass error to the callback
        },
        // Include the SECRET_HASH in the authentication parameters
        clientMetadata: {
            SECRET_HASH: secretHash
        }
    });
}

// Example usage:
//const username = 'example_username';
//const password = 'example_password';

//authenticateUser(username, password, function (err, accessToken) {
  //  if (err) {
    //    console.error('Authentication error:', err);
        // Handle authentication failure
  //  } else {
    //    console.log('Access Token:', accessToken);
        // Use the access token as needed
   // }
//});
