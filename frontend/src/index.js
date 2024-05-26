import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import Profile from './pages/Profile/Profile';

const clerkPubkey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubkey) {
  console.error("Clerk Publishable Key is missing.");
}

const root = ReactDOM.createRoot(document.getElementById('root'));

const ClerkWithRoutes = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={clerkPubkey}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/sign-in/*' element={<SignIn routing='path' redirectUrl='/' />} />
        <Route path='/sign-up/*' element={<SignUp routing='path' redirectUrl='/' />} />
        <Route
          path='/profile'
          element={
            <>
              <SignedIn>
                <Profile />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
