'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {foreignKey:{name:'userid', allowNull:false}}),
      Reservation.belongsTo(models.Chambre, {foreignKey:{name:'chambreid', allowNull:false}})
    }
  }
  Reservation.init({
    chambreid: DataTypes.UUID,
    userid: DataTypes.UUID,
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};