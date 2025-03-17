import { Auth0Provider } from '@auth0/auth0-react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
<Auth0Provider
    domain="dev-7gjpb1pbewdz72lw.us.auth0.com"
    clientId="4UmGXyc5PvJg1prmstjpKfJoYiucjZn9"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);