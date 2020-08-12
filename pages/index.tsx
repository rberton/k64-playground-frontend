import React, { useState, lazy, Suspense, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import Head from "next/head";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { destroyToken } from "../config/client";
import GET_USER from "../resources/graphql/query/user";
import "../resources/scss/styles.scss";

const Index: React.FunctionComponent = (): React.ReactElement => {
  const SignUp = lazy(() => import("../components/SignUp"));
  const SignIn = lazy(() => import("../components/SignIn"));

  const [index, setIndex] = useState({
    displaySignUp: false,
    displaySignIn: false,
    connected: false,
    user: {},
    drawer: false,
  });

  const userId = Cookies.get("userId") || "";

  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      userId,
    },
  });

  useEffect(() => {
    let indexState = {
      ...index,
      displaySignUp: false,
      displaySignIn: false,
      connected: !!userId,
    };

    if (indexState.connected && data && data.user) {
      indexState = {
        ...indexState,
        user: data.user,
      };
    }

    setIndex(indexState);

    return () => {
      setIndex({
        ...index,
        connected: false,
      });
    };
  }, [index.connected]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error !</p>;

  const signUpHandler = () => {
    setIndex({
      ...index,
      displaySignUp: true,
      displaySignIn: false,
    });
  };

  const signInHandler = () => {
    setIndex({
      ...index,
      displaySignUp: false,
      displaySignIn: true,
    });
  };

  const connectHandler = () => {
    const userId = Cookies.get("userId");
    setIndex({
      ...index,
      displaySignUp: false,
      displaySignIn: false,
      connected: !!userId,
    });
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setIndex({
      ...index,
      drawer: open,
    });
  };

  const logoutHandler = () => {
    destroyToken();
    Cookies.remove("userId");
    setIndex({
      ...index,
      displaySignUp: false,
      displaySignIn: false,
      connected: false,
    });
  };

  return (
    <>
      <Head>
        <title>Homepage</title>
      </Head>
      <main className="index">
        {!index.connected && (
          <>
            <h1>k64Playground</h1>
            <article>
              <section className="index-controls">
                {!index.displaySignUp && (
                  <Button onClick={signUpHandler}>S&apos;enregistrer</Button>
                )}
                {!index.displaySignIn && (
                  <Button onClick={signInHandler}>Se connecter</Button>
                )}
              </section>
              {index.displaySignUp && (
                <Suspense fallback={<CircularProgress />}>
                  <SignUp connectHandler={connectHandler} />
                </Suspense>
              )}
              {index.displaySignIn && (
                <Suspense fallback={<CircularProgress />}>
                  <SignIn connectHandler={connectHandler} />
                </Suspense>
              )}
            </article>
          </>
        )}
        {index.connected && (
          <article>
            <header className="index-header">
              <Button onClick={toggleDrawer(true)}>
                <i className="fas fa-bars" />
              </Button>
              <Drawer
                anchor="left"
                open={index.drawer}
                onClose={toggleDrawer(false)}
              >
                <List>
                  {["Profil", "Membres", "Préférences", "Mentions légales"].map(
                    (text, index) => (
                      <ListItem button key={text}>
                        <ListItemText primary={text} />
                      </ListItem>
                    )
                  )}
                </List>
              </Drawer>
              <h1>k64Playground</h1>
              <Button onClick={logoutHandler}>
                <i className="fas fa-power-off" />
              </Button>
            </header>
            <p>You are connected !</p>
          </article>
        )}
      </main>
    </>
  );
};

// Index.defaultProps = {
//   data: null,
//   loading: false,
//   err: undefined,
// };

// Index.propTypes = {
//   data: PropTypes.object,
//   loading: PropTypes.bool,
//   err: PropTypes.string
// };

export default Index;
