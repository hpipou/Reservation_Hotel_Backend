'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chambres', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      parking: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      wifi: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      fumeur: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      salleSport: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      restaurant: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      reception: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      accessHandicap: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      terrasse: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      bar: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      petitDej: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      images: {
        allowNull: false,
        type: Sequelize.JSON
      },
      userid: {
        allowNull: false,
        type: Sequelize.UUID,
        references:{
          model:'Users',
          ket:'id'
        }
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chambres');
  }
};