'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(191)
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(191)
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(191)
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(191)
      },
      confirmedPassword: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      loggedIn: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      lastLogin: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      biography: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      isAdmin: {
        allowNull: false,
        default: false,
        type: Sequelize.BOOLEAN
      },
      companyServices: {
        allowNull: true,
        type: Sequelize.STRING(191)
      },
      coverPicture: {
        allowNull: true,
        type: Sequelize.STRING(191)
      },
      profilePicture: {
        allowNull: true,
        type: Sequelize.STRING(191)
      },
      emailVerified: {
        allowNull: false,
        default: false,
        type: Sequelize.BOOLEAN
      },
      emailToken: {
        allowNull: false,
        type: Sequelize.STRING(191)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};