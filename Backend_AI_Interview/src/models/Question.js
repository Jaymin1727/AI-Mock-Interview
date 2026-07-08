const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Interview = require('./Interview');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  interviewId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Interview,
      key: 'id'
    }
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  hint: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Question;
