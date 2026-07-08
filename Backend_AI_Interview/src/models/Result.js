const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Interview = require('./Interview');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  interviewId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: Interview,
      key: 'id'
    }
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  communicationScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  technicalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  confidenceScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  problemSolvingScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  clarityScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  strengths: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  weaknesses: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  suggestions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  questionScores: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  }
}, {
  timestamps: true,
});

module.exports = Result;
