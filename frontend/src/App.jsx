import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ManagementDashboard from './pages/ManagementDashboard.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import CompaniesPage from './pages/CompaniesPage.jsx';
import SkillIntelligence from './pages/SkillIntelligence.jsx';
import AtRiskStudents from './pages/AtRiskStudents.jsx';
import RecruiterIntelligence from './pages/RecruiterIntelligence.jsx';
import PlacementTrends from './pages/PlacementTrends.jsx';
import AICommandCenter from './pages/AICommandCenter.jsx';
import StudentMode from './pages/StudentMode.jsx';

export default function App() {
  const [mode, setMode] = useState(null); // 'student' | 'management' | null

  if (!mode) {
    return <LandingPage onSelectMode={setMode} />;
  }

  if (mode === 'student') {
    return <StudentMode onBack={() => setMode(null)} />;
  }

  return (
    <Layout onBack={() => setMode(null)}>
      <Routes>
        <Route path="/" element={<ManagementDashboard />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/skills" element={<SkillIntelligence />} />
        <Route path="/at-risk" element={<AtRiskStudents />} />
        <Route path="/recruiters" element={<RecruiterIntelligence />} />
        <Route path="/trends" element={<PlacementTrends />} />
        <Route path="/ai-command" element={<AICommandCenter />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}
