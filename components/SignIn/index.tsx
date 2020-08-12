import React, { useState, FormEvent } from "react";
import { Mutation } from "@apollo/react-components";
import PropTypes from "prop-types";
import { FormControl, TextField, Button } from "@material-ui/core";
import Cookies from "js-cookie";
import SET_USER from "../../resources/graphql/mutation/setUser";
import { setToken } from "../../config/client";
import { validateEmail } from "../../utils/validation";
import "./signIn.scss";

type TData = {
  createUser: {
    token: string;
    id: BigInt;
  };
};

type TVariables = {
  userInput: string;
};

const SignIn = ({ connectHandler, err }) => {
  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (event) => {
    setSignIn({
      ...signIn,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    setUser: any,
    event: FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();

      if (validateEmail(signIn.email)) {
        const userDatas = await setUser({
          variables: {
            userInput: { ...signIn },
          },
        });
        const { token, userId } = userDatas.data.setUser;
        setToken(token);
        Cookies.set("userId", userId, { expires: 7 });

        return connectHandler();
      }
      throw new Error("Invalid Email");
    } catch (error) {
      throw new Error("Check your connection");
    }
  };

  return (
    <section className="signIn">
      <h2>Connexion</h2>
      <Mutation<TData, TVariables> mutation={SET_USER}>
        {(setUser, props) => (
          <form onSubmit={(event) => handleSubmit(setUser, event)}>
            <FormControl>
              <TextField
                type="email"
                name="email"
                label="Email"
                autoComplete="new-email"
                value={signIn.email}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                name="password"
                label="Mot de passe"
                autoComplete="new-password"
                value={signIn.password}
                onChange={changeHandler}
              />
            </FormControl>
            <Button type="submit">Se connecter</Button>
          </form>
        )}
      </Mutation>
    </section>
  );
};

SignIn.getInitialProps = async (ctx) => {
  try {
    const { connectHandler } = ctx;

    return { connectHandler };
  } catch (error) {
    return {
      err: "Failed to get connectHandler",
    };
  }
};

SignIn.defaultProps = {
  connectHandler: () => {},
  err: null,
};

SignIn.propTypes = {
  connectHandler: PropTypes.func,
  err: PropTypes.string,
};

export default SignIn;
