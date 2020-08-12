import { gql } from "@apollo/client";

const GET_USER = gql`
  query User($userId: ID!) {
    user(userId: $userId) {
      _id
      firstname
      lastname
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export default GET_USER;
