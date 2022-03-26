import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    username: String!
    password: String
    email: String
    firstName: String
    lastName: String
    phone: String
  }
  type AuthResponse {
    user: User
    token: String
  }

  type Query {
    hello: String
    getUsers: [User]
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
      email: String!
      firstName: String
      lastName: String
      phone: String
    ): User
    login(username: String!, password: String!): AuthResponse
  }
`;

export default typeDefs;
