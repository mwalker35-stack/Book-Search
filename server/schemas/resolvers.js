const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const { User } = require("../models");

const resolvers = {
    Query: {
      //get a user by the username
      me: async (parent, args, context) => {
        if(context.user) {
          const userData = await User.findOne({})
          .select('-__v -password')
          .populate('books')

          return userData;
        }
        throw new AuthenticationError('Please login!')
      },
    },
    Mutation: {
      login: async (parent, {email, password}) => {
          const user = await User.findOne({email});

          if(!user) {
            throw new AuthenticationError("Can't find this user");
          }
          const correctPw = await user.isCorrectPassword(password);
          if(!correctPw) {
            throw new AuthenticationError('Wrong password!')
          }
          const token = signToken(user);
          return {token, user};
      },
      addUser: async(parent, args, context) => {
        const user = await User.create(args);
        const token= signToken(user);

        return {token, user};
      },
      saveBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true, runValidators: true }
          );

          return updatedUser;
        }
        throw new AuthenticationError("Couldn't find user with this id!")
      },
      removeBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError("Couldn't find user with this id!")
      }
    }
  };

  module.exports = resolvers