'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post)
      models.User.hasMany(models.Comment)
    }
  };
  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    biography: DataTypes.TEXT,
    isAdmin: DataTypes.BOOLEAN,
    companyServices: DataTypes.STRING,
    coverPicture: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    isRegisterActive: DataTypes.BOOLEAN,
    registerId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};