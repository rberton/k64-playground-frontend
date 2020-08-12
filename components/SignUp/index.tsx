import React, { useState, FormEvent } from "react";
import { FormControl, TextField, Button } from "@material-ui/core";
import Cookies from "js-cookie";
import { Mutation } from "@apollo/react-components";
import PropTypes from "prop-types";
import CREATE_USER from "../../resources/graphql/mutation/createUser";
import GET_ROLES from "../../resources/graphql/query/role";
import { setToken } from "../../config/client";
import { validateEmail } from "../../utils/validation";
import "./signUp.scss";

interface ITarget {
  name: string;
  value: string;
}

interface IEvent {
  target: ITarget;
  preventDefault: Function;
}

interface IHandler<IEvent> {
  (event: IEvent): void;
}

interface ISubmitHandler<TData, IEvent> {
  (event: IEvent): Promise<IEvent>;
}

type TData = {
  createUser: {
    token: string;
    id: BigInt;
  };
};

type TVariables = {
  userInput: string;
};

const SignUp = ({ data, loading, connectHandler, err }): React.ReactElement => {
  const [signUp, setSignUp] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  let message = "Roles";
  if (loading) message = "Loading...";
  if (err) message = `Error! ${err}`;
  if (data && data.roles.length <= 0) message = "No Roles";

  const changeHandler: IHandler<IEvent> = (event: IEvent): void => {
    setSignUp({
      ...signUp,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (
    createUser: any,
    event: FormEvent<HTMLFormElement>
  ) => {
    try {
      event.preventDefault();

      if (validateEmail(signUp.email)) {
        if (
          signUp.password !== "" &&
          signUp.password === signUp.passwordConfirm
        ) {
          const userDatas = await createUser({
            variables: {
              userInput: {
                ...signUp,
                passwordConfirm: true,
                role: "Guest",
              },
            },
          });
          const { token, userId } = userDatas.data.createUser;
          setToken(token);
          Cookies.set("userId", userId, { expires: 7 });

          return connectHandler();
        }
        throw new Error("Invalid confirmation");
      } else {
        throw new Error("Invalid Email");
      }
    } catch (error) {
      throw new Error("Check your connection");
    }
  };

  return (
    <section className="signUp">
      <h2>Enregistrement</h2>
      <Mutation<TData, TVariables> mutation={CREATE_USER}>
        {(createUser, props) => (
          <form onSubmit={(event) => handleSubmit(createUser, event)}>
            <FormControl>
              <TextField
                type="text"
                name="firstname"
                label="Prénom"
                value={signUp.firstname}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="text"
                name="lastname"
                label="Nom"
                value={signUp.lastname}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="email"
                name="email"
                label="Email"
                autoComplete="new-email"
                value={signUp.email}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                name="password"
                label="Mot de passe"
                autoComplete="new-password"
                value={signUp.password}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                name="passwordConfirm"
                label="Confirmation"
                autoComplete="new-password"
                value={signUp.passwordConfirm}
                onChange={changeHandler}
              />
            </FormControl>
            <Button type="submit">S&apos;inscrire</Button>
          </form>
        )}
      </Mutation>
    </section>
  );
};

SignUp.getInitialProps = async (ctx) => {
  try {
    const { connectHandler } = ctx;
    const { data, loading } = await ctx.apolloClient.query({
      query: GET_ROLES,
    });

    return { data, loading, connectHandler };
  } catch (error) {
    return {
      err: "Failed to fetch",
    };
  }
};

SignUp.defaultProps = {
  data: null,
  loading: null,
  connectHandler: () => {},
  err: null,
};

SignUp.propTypes = {
  data: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.object),
  }),
  loading: PropTypes.bool,
  connectHandler: PropTypes.func,
  err: PropTypes.string,
};

export default SignUp;
