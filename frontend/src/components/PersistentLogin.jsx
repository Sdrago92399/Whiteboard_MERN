import React, { useLayoutEffect } from 'react';
import useAuth from "@/redux/dispatch/useAuth";
import LoadingSpinner from "./LoadingSpinner";

function PersistentLogin({ children }) {
  const { refershToken, auth } = useAuth();

  useLayoutEffect(() => {
    refershToken();
  }, []);

  if (auth.loading) return <LoadingSpinner />;

  return <>{children}</>;
}

export default PersistentLogin;
