'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chambre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chambre.belongsTo(models.User, {foreignKey:{name:'userid', allowNull:false}}),
      Chambre.hasMany(models.Reservation)
    }
  }
  Chambre.init({
    id:DataTypes.UUID,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    parking: DataTypes.BOOLEAN,
    wifi: DataTypes.BOOLEAN,
    fumeur: DataTypes.BOOLEAN,
    salleSport: DataTypes.BOOLEAN,
    restaurant: DataTypes.BOOLEAN,
    reception: DataTypes.BOOLEAN,
    accessHandicap: DataTypes.BOOLEAN,
    terrasse: DataTypes.BOOLEAN,
    bar: DataTypes.BOOLEAN,
    petitDej: DataTypes.BOOLEAN,
    images: DataTypes.JSON,
    userid: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Chambre',
  });
  return Chambre;
};