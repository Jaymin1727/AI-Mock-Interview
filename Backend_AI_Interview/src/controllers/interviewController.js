const { Interview, Question, Result, User } = require('../models');
const { generateQuestions, evaluateInterview } = require('../services/geminiService');
const { AppError } = require('../middleware/errorHandler');

// @desc    Start a new interview
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      return next(new AppError(400, 'Role is required'));
    }

    // Generate questions using Gemini
    const questionsData = await generateQuestions(role, 4);

    // Create interview record
    const interview = await Interview.create({
      userId: req.user.id,
      role: role,
      status: 'in_progress'
    });

    // Save questions to DB
    const questions = await Promise.all(
      questionsData.map(q => 
        Question.create({
          interviewId: interview.id,
          questionText: q.questionText,
          hint: q.hint,
          orderIndex: q.orderIndex
        })
      )
    );

    res.status(201).json({
      status: 'success',
      data: {
        interview: {
          id: interview.id,
          role: interview.role,
          status: interview.status
        },
        questions: questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          hint: q.hint,
          orderIndex: q.orderIndex
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an answer for a question
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const interviewId = req.params.id;

    // Verify interview belongs to user
    const interview = await Interview.findOne({
      where: { id: interviewId, userId: req.user.id }
    });

    if (!interview) {
      return next(new AppError(404, 'Interview not found'));
    }

    if (interview.status !== 'in_progress') {
      return next(new AppError(400, 'Interview is not in progress'));
    }

    // Find question and update answer
    const question = await Question.findOne({
      where: { id: questionId, interviewId }
    });

    if (!question) {
      return next(new AppError(404, 'Question not found'));
    }

    question.answer = answer;
    await question.save();

    res.status(200).json({
      status: 'success',
      message: 'Answer saved'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finish the interview and evaluate
// @route   POST /api/interviews/:id/finish
// @access  Private
const finishInterview = async (req, res, next) => {
  try {
    const interviewId = req.params.id;
    const { duration } = req.body;

    const interview = await Interview.findOne({
      where: { id: interviewId, userId: req.user.id }
    });

    if (!interview) {
      return next(new AppError(404, 'Interview not found'));
    }

    if (interview.status === 'completed') {
      return next(new AppError(400, 'Interview already completed'));
    }

    // Fetch all questions and answers
    const questions = await Question.findAll({
      where: { interviewId },
      order: [['orderIndex', 'ASC']]
    });

    // Format for AI
    const qaPairs = questions.map(q => ({
      questionText: q.questionText,
      answer: q.answer
    }));

    // Call Gemini to evaluate
    const evaluation = await evaluateInterview(interview.role, qaPairs);

    // Create Result record
    const result = await Result.create({
      interviewId: interview.id,
      overallScore: evaluation.overallScore,
      communicationScore: evaluation.communicationScore,
      technicalScore: evaluation.technicalScore,
      confidenceScore: evaluation.confidenceScore,
      problemSolvingScore: evaluation.problemSolvingScore,
      clarityScore: evaluation.clarityScore,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      suggestions: evaluation.suggestions,
      questionScores: evaluation.questionScores
    });

    // Update individual questions with feedback
    await Promise.all(
      evaluation.questionScores.map((qs) => {
        const q = questions[qs.questionIndex];
        if (q) {
          q.score = qs.score;
          q.feedback = qs.feedback;
          return q.save();
        }
      })
    );

    // Update interview status
    interview.status = 'completed';
    interview.overallScore = evaluation.overallScore;
    interview.completedAt = new Date();
    if (duration) interview.duration = duration;
    await interview.save();

    // Increment user's total interviews
    const user = req.user;
    user.totalInterviews += 1;
    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        result,
        questions: questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          answer: q.answer,
          score: q.score,
          feedback: q.feedback
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  finishInterview
};
