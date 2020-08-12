import gql from "graphql-tag";

const SET_USER = gql`
  mutation setUser($userInput: UserInput) {
    setUser(userInput: $userInput) {
      token
      userId
    }
  }
`;

export default SET_USER;
