import gql from "graphql-tag";

const GET_ROLES = gql`
  {
    roles {
      _id
      label
    }
  }
`;

export default GET_ROLES;
