'use strict';
// Imports
const { Model } = require('sequelize')
const bcrypt    = require('bcrypt')

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
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Le prénom est une propriété requise.`},
        len: {
          args: [3,40],
          msg: `Le prénom doit contenir entre 3 et 40 caractères.`
        },
        is: {
          args: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i,
          msg: `Le prénom ne peut contenir que des lettres, des espaces et des traits d'union.`
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Le nom est une propriété requise.` },
        len: {
          args: [3, 40],
          msg: `Le nom doit contenir entre 3 et 40 caractères.`
        },
        is: {
          args: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i,
          msg: `Le nom ne peut contenir que des lettres, des espaces et des traits d'union.`
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: `L'email est une propriété requise.` },
        isEmail: { msg: `L'adresse email saisie, n'est pas une adresse mail valide.` },
      },
      unique: {
        args: true,
        msg: `L'adresse email saisie, ne peut être utilisée.`
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: `Le mot de passe est une propriété requise.` },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?/&])[A-Za-z\d@$!%*.?/&]{8,64}$/i,
          msg: `Votre mot de passe semble simple : vous pouvez l'améliorer en ajoutant des lettres majuscules, minuscules, des chiffres ou des symboles supplémentaires.`
        }
      }
    },
    confirmedPassword: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      set(value) {
        if(value === this.password) {
          this.setDataValue('confirmedPassword', true)
        }
      },
      validate: {
        notNull: {msg: `Les mots de passe saisies ne correspondent pas.` },
        notEmpty: {msg: `La confirmation du mot de passe est une propriété requise.` },
      }
    },
    loggedIn: DataTypes.DATE,
    lastLogin:DataTypes.DATE,
    biography: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [5, 180],
          msg: `La biographie doit contenir entre 5 et 180 caractères.`
        },
        is: {
          args: /^[^*{}|<>=\[\]`\\^§]+$/i,
          msg: "Votre biographie ne peut contenir les caractères spéciaux suivants : * { } | < > = [ ] \ ` ^ §"
        }
      }
    },
    isAdmin: DataTypes.BOOLEAN,
    companyServices: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 60],
          msg: `Le nom de service doit contenir entre 3 et 60 caractères.`
        },
        is: {
          args: /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/i,
          msg: `Le nom de service ne peut contenir que des lettres, des espaces et des traits d'union.`
        }
      }
    },
    coverPicture: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    emailToken: DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = bcrypt.hashSync(user.password, 10)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};