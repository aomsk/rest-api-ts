// user model / schema

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: "string", required: true },
  email: { type: "string", required: true },
  authentication: {
    password: { type: "string", required: false },
    salt: { type: "string", required: true },
    sessionToken: { type: "string", select: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

// actions used in controller
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values)
    .save()
    .then((user) => user.toObject())
    .catch((error) => console.log(error));
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
