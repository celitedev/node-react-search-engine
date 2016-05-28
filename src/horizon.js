let Horizon;
let horizon;
if (!process.env.SERVER_RENDERING) {
  Horizon = require('@horizon/client');
  horizon = Horizon();
}

export const clearAuthToken = () => {
  Horizon.clearAuthTokens();
  window.location = '/';
};

export const login = (provider) => {
    window.history.pushState('login', 'doLogin', '/');
    horizon.authEndpoint(provider).subscribe((endpoint) => {
      window.location.pathname = endpoint;
    });
};
