const {Sequelize} = require('sequelize');

module.exports = new Sequelize('postgres://user:pass@localhost:5432/dbname');