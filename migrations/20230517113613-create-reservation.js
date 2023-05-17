'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      chambreid: {
        allowNull: false,
        type: Sequelize.UUID,
        references:{
          model:'Chambres',
          ket:'id'
        }
      },
      userid: {
        allowNull: false,
        type: Sequelize.UUID,
        references:{
          model:'Users',
          ket:'id'
        }
      },
      dateDebut: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dateFin: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Reservations');
  }
};