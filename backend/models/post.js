'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.hasMany(models.Comment)
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Post.init({
    content: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: `Le contenu d'une publication est une propriété requise, il ne peut pas être vide.` },
        len: {
          args: [5,],
          msg: `La publication doit contenir au minimum 5 caractères.`
        },
        is: {
          args: /^[^*{}|<>=\[\]`\\^§]+$/i,
          msg: "La publication ne peut pas contenir les caractères spéciaux suivants : * { } | < > = [ ] \ ` ^ §"
        }
      }
    },
    attachement: DataTypes.STRING,
    likes: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};