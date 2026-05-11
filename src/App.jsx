import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StudyPage from './pages/StudyPage';
import QuizPage from './pages/QuizPage';
import SubjectsPage from './pages/SubjectsPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/study"     element={<StudyPage />} />
          <Route path="/quiz"      element={<QuizPage />} />
          <Route path="/subjects"  element={<SubjectsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*"          element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
