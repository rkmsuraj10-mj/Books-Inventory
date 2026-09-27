import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CurriculumSection } from './components/CurriculumSection';
import { QuizEngine } from './components/QuizEngine';
import { CertificateSection } from './components/CertificateSection';
import { CanonicalBanner } from './components/CanonicalBanner';
import { Footer } from './components/Footer';

// Modals
import { CanonicalReaderModal } from './components/CanonicalReaderModal';
import { CertificateModal } from './components/CertificateModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PracticeQuizModal } from './components/PracticeQuizModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { ReviewSolutionsModal } from './components/ReviewSolutionsModal';
import { CharterModal } from './components/CharterModal';
import { StudyModeDrawer } from './components/StudyModeDrawer';

// Data & Types
import { COURSE_MODULES, MODULE_3_QUESTIONS } from './data/curriculumData';
import { StudentProfile } from './types';

export default function App() {
  // Global & Student State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    name: 'Ananya Sengupta',
    institution: 'Presidency University, Kolkata',
    certificateId: 'SV-1893-9021',
    enrolledDate: 'August 2025',
    aggregateScore: 90,
    modulesCompleted: 2,
    totalModules: 5,
    honorsConferred: true
  });

  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'HI' | 'MR'>('EN');
  const [studyModeActive, setStudyModeActive] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('course-modules');

  // Active Assessment State
  const [activeModuleId, setActiveModuleId] = useState<number>(3);
  // Default to question 4 (0-indexed 3) as shown in the reference design screenshot!
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(3);
  // Option B (1893) selected initially on Question 4 as shown in the reference!
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({
    4: 'B',
    1: 'A',
    2: 'B',
    3: 'C'
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Modals visibility state
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerInitialId, setReaderInitialId] = useState<string | undefined>();
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [reviewSolutionsOpen, setReviewSolutionsOpen] = useState(false);
  const [charterModalTitle, setCharterModalTitle] = useState<string | null>(null);

  // Smooth scroll handler
  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectAnswer = (questionId: number, optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleToggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleStartChapter1Quiz = () => {
    setActiveModuleId(1);
    setCurrentQuestionIndex(0);
    handleNavigateSection('active-quiz-engine');
  };

  const handleSelectModule = (moduleId: number) => {
    setActiveModuleId(moduleId);
    if (moduleId === 3) {
      setCurrentQuestionIndex(3);
    } else {
      setCurrentQuestionIndex(0);
    }
    handleNavigateSection('active-quiz-engine');
  };

  const handleReviewModule = (moduleId: number) => {
    setActiveModuleId(moduleId);
    setReviewSolutionsOpen(true);
  };

  const handleOpenCanonical = (id?: string) => {
    setReaderInitialId(id);
    setReaderOpen(true);
  };

  const handleUpdateStudentName = (newName: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      name: newName
    }));
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1b1c] font-sans flex flex-col selection:bg-[#ffdbcf] selection:text-[#380d00]">
      {/* 1. Fixed Header Navigation */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        studyModeActive={studyModeActive}
        onToggleStudyMode={() => setStudyModeActive(!studyModeActive)}
        onOpenPortal={() => setPortalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        onOpenPracticeQuiz={() => setPracticeOpen(true)}
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
        studentName={studentProfile.name}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {/* 2. Hero & Inspirational Academic Overview */}
        <HeroSection
          onStartQuiz={handleStartChapter1Quiz}
          onExploreCurriculum={() => handleNavigateSection('curriculum-path')}
          onVerifyCertificate={() => setCertificateOpen(true)}
          currentLanguage={currentLanguage}
        />

        {/* 3. Curriculum Syllabus & Assessment Path */}
        <CurriculumSection
          modules={COURSE_MODULES}
          activeModuleId={activeModuleId}
          onSelectModule={handleSelectModule}
          onReviewAnswers={handleReviewModule}
        />

        {/* 4. Interactive Quiz / MCQ Interface (Focus: Module 3) */}
        <QuizEngine
          questions={MODULE_3_QUESTIONS}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionIndexChange={setCurrentQuestionIndex}
          selectedAnswers={selectedAnswers}
          onSelectAnswer={handleSelectAnswer}
          flaggedQuestions={flaggedQuestions}
          onToggleFlag={handleToggleFlag}
          moduleTitle="Module 3 — Chicago Parliament of Religions (1893)"
          onCompleteModule={() => {
            handleNavigateSection('distinction-certificate');
          }}
        />

        {/* 5. Results, Summary & Certification Readiness */}
        <CertificateSection
          studentName={studentProfile.name}
          onDownloadCertificate={() => setCertificateOpen(true)}
          onReviewSolutions={() => setReviewSolutionsOpen(true)}
        />

        {/* 6. Historical Study Archive / Digital Library Banner */}
        <CanonicalBanner onOpenReader={() => handleOpenCanonical()} />
      </main>

      {/* 7. Comprehensive Academic Footer */}
      <Footer
        onOpenCanonicalLink={(id) => handleOpenCanonical(id)}
        onOpenCharter={(title) => setCharterModalTitle(title)}
      />

      {/* Interactive Modals */}
      <CanonicalReaderModal
        isOpen={readerOpen}
        onClose={() => setReaderOpen(false)}
        initialReadingId={readerInitialId}
      />

      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        initialName={studentProfile.name}
        onUpdateName={handleUpdateStudentName}
      />

      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        currentStudentName={studentProfile.name}
      />

      <PracticeQuizModal
        isOpen={practiceOpen}
        onClose={() => setPracticeOpen(false)}
      />

      <StudentPortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
        profile={studentProfile}
        onUpdateName={handleUpdateStudentName}
        onViewCertificate={() => setCertificateOpen(true)}
      />

      <ReviewSolutionsModal
        isOpen={reviewSolutionsOpen}
        onClose={() => setReviewSolutionsOpen(false)}
        questions={MODULE_3_QUESTIONS}
        moduleTitle="Module 3: Chicago Parliament of Religions & Western Tours"
      />

      <CharterModal
        isOpen={!!charterModalTitle}
        onClose={() => setCharterModalTitle(null)}
        title={charterModalTitle || ''}
      />

      <StudyModeDrawer
        isOpen={studyModeActive}
        onClose={() => setStudyModeActive(false)}
        language={currentLanguage}
      />
    </div>
  );
}
