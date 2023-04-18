const {gql} = require('apollo-server-express')

const typeDefs = gql `
  type Query {
    me: User
  } 
  type Mutation {
    login(email: String, password: String): Auth
    addUser(username: String, email: String, password: String): Auth
    saveBook(authors:[String], description: String, title: String, bookId: String, image: String, link: String): User
    removeBook(bookId: String): User
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks:[Book]
  }
  type Book {
    bookId: ID
    authors:[String]
    description: String
    title: String
    image: String
    link: String
  }
  
  input savedBook {
    description: String
    title: String
    bookId: String
    image: String
    link: String
    authors: [String]
}

  type Auth {
    token: String
    user: User
  }
`;

module.exports = typeDefs