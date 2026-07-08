const sequelize = require('../config/database');
const User = require('./User');
const Interview = require('./Interview');
const Question = require('./Question');
const Result = require('./Result');

// Associations
User.hasMany(Interview, { foreignKey: 'userId' });
Interview.belongsTo(User, { foreignKey: 'userId' });

Interview.hasMany(Question, { foreignKey: 'interviewId', as: 'questions' });
Question.belongsTo(Interview, { foreignKey: 'interviewId' });

Interview.hasOne(Result, { foreignKey: 'interviewId', as: 'result' });
Result.belongsTo(Interview, { foreignKey: 'interviewId' });

module.exports = {
  sequelize,
  User,
  Interview,
  Question,
  Result
};
