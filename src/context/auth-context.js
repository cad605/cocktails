import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAsync } from "../utils/hooks";
import * as auth from "auth-provider";

async function bootstrapAppData() {
  let user = null;

  const token = await auth.getToken();
  if (token) {
    //...do something like getUser()
    //   const data = await client('bootstrap', {token})
    //   queryCache.setQueryData('list-items', data.listItems, {
    //     staleTime: 5000,
    //   })
    //   for (const listItem of data.listItems) {
    //     setQueryDataForBook(listItem.book)
    //   }
    //   user = data.user
  }
  return user;
}

const AuthContext = createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const login = useCallback(
    (form) => {
      auth.login(form).then((user) => setData(user));
    },
    [setData]
  );

  const register = useCallback(
    (form) => {
      auth.register(form).then((user) => setData(user));
    },
    [setData]
  );

  const logout = useCallback(() => {
    auth.logout();
    setData(null);
  }, [setData]);

  const value = useMemo(
    () => ({ user, login, logout, register }),
    [login, logout, register, user]
  );

  if (isLoading || isIdle) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div error={error} />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }

  return context;
}

export { AuthProvider, useAuth };
