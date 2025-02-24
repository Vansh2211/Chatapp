import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "170883333651-tvnfmthkveifc52jmos7835jm18napql.apps.googleusercontent.com"; // Replace with your actual Client ID

const GoogleLoginButton: React.FC = () => {
  const handleSuccess = (credentialResponse: any) => {
    console.log("Google Login Success:", credentialResponse);

    // Store the token in localStorage (Optional)
    localStorage.setItem("googleToken", credentialResponse.credential);

    // You can now use this token to authenticate user requests
    alert("Login Successful!");
  };

  const handleFailure = () => {
    console.log("Google Login Failed");
    alert("Login Failed. Try again!");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
