import "../../scss/global.scss"
import "semantic-ui-css/semantic.min.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "context/AuthContext";
import { useMemo, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { setToken, getToken, removeToken } from "api/token";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {

  const [auth, setAuth] = useState(undefined);
  const [reloadUser, setReloadUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    //console.log(token);
    if (token) {
      setAuth({
        token,
        idUser: jwtDecode(token).id
      })
    } else {
      setAuth(null);
    }
    setReloadUser(false);
  }, [reloadUser]);


  const login = (token) => {
    setToken(token);
    setAuth({
      token,
      idUser: jwtDecode(token).id
    })
  }


  const logout = () => {
    if (auth) {
      removeToken();
      setAuth(null);
      router.push("/");
    }
  }


  const authData = useMemo(
    () => ({
      auth: auth,
      login: login,
      logout: logout,
      setReloadUser: setReloadUser,
    }),
    [auth]
  )

  if (auth === undefined) return null;

  return (
    <AuthContext.Provider value={authData}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newesOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  )
}
