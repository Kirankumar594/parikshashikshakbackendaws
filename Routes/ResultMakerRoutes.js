const express = require('express');
const router = express.Router();
const { Authentication } = require('../Authentication/auth');

const SchoolController = require('../Controller/ResultMaker/SchoolController');
const ClassController = require('../Controller/ResultMaker/ClassController');
const StudentController = require('../Controller/ResultMaker/StudentController');
const TermController = require('../Controller/ResultMaker/TermController');
const AssessmentTypeController = require('../Controller/ResultMaker/AssessmentTypeController');
const SubjectController = require('../Controller/ResultMaker/SubjectController');
const MarksController = require('../Controller/ResultMaker/MarksController');
const ExamSettingsController = require('../Controller/ResultMaker/ExamSettingsController');

// School Routes
router.post('/school/save', Authentication, SchoolController.saveSchoolProfile);
router.get('/school/profile', Authentication, SchoolController.getSchoolProfile);

// Class Routes
router.post('/class/add', Authentication, ClassController.addClass);
router.get('/class/all', Authentication, ClassController.getAllClasses);
router.delete('/class/:classId', Authentication, ClassController.deleteClass);

// Student Routes
router.post('/student/add', Authentication, StudentController.addStudent);
router.get('/student/all', Authentication, StudentController.getAllStudents);
router.get('/student/class/:classId', Authentication, StudentController.getStudentsByClass);
router.put('/student/:studentId', Authentication, StudentController.updateStudent);
router.delete('/student/:studentId', Authentication, StudentController.deleteStudent);

// Term Routes
router.post('/term/add', Authentication, TermController.addTerm);
router.get('/term/all', Authentication, TermController.getAllTerms);
router.delete('/term/:termId', Authentication, TermController.deleteTerm);

// Assessment Type Routes
router.post('/assessment/add', Authentication, AssessmentTypeController.addAssessmentType);
router.get('/assessment/all', Authentication, AssessmentTypeController.getAllAssessmentTypes);
router.delete('/assessment/:assessmentId', Authentication, AssessmentTypeController.deleteAssessmentType);

// Subject Routes
router.post('/subject/add', Authentication, SubjectController.addSubject);
router.get('/subject/all', Authentication, SubjectController.getAllSubjects);
router.delete('/subject/:subjectId', Authentication, SubjectController.deleteSubject);

// Marks Routes
router.post('/marks/save', Authentication, MarksController.saveMarks);
router.get('/marks/get', Authentication, MarksController.getMarks);
router.get('/marks/student/:studentId', Authentication, MarksController.getStudentMarks);
router.delete('/marks/:marksId', Authentication, MarksController.deleteMarks);

// Exam Settings Routes
router.post('/exam-settings/save', Authentication, ExamSettingsController.saveExamSettings);
router.get('/exam-settings/:classId', Authentication, ExamSettingsController.getExamSettings);
router.get('/exam-settings/all', Authentication, ExamSettingsController.getAllExamSettings);
router.delete('/exam-settings/:classId', Authentication, ExamSettingsController.deleteExamSettings);

module.exports = router;
