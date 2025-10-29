import React, { useState, useEffect } from 'react';
import { Page, type User, type StudyPlan } from './types';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyPlannerCreator from './components/StudyPlannerCreator';
import StudyPlanView from './components/StudyPlanView';
import BrainBuzz from './components/BrainBuzz';
import AiAssistant from './components/AiAssistant';
import { MenuIcon, CloseIcon } from './components/icons';

const USER_STORAGE_KEY = 'aiStudyPlanner_user';
const PLANS_STORAGE_KEY_PREFIX = 'aiStudyPlanner_plans_';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [quizTopic, setQuizTopic] = useState<string | null>(null);

  // Effect to handle user session persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Effect to load/clear plans when user changes (login/logout)
  useEffect(() => {
    if (user) {
      try {
        const storedPlans = localStorage.getItem(`${PLANS_STORAGE_KEY_PREFIX}${user.email}`);
        setStudyPlans(storedPlans ? JSON.parse(storedPlans) : []);
      } catch (error) {
        console.error("Error parsing plans from localStorage:", error);
        setStudyPlans([]);
      }
    } else {
      setStudyPlans([]); // Clear plans on logout
    }
  }, [user]);

  // Effect to persist plans when they are updated
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${PLANS_STORAGE_KEY_PREFIX}${user.email}`, JSON.stringify(studyPlans));
    }
  }, [studyPlans, user]);


  const handleLogin = (email: string) => {
    const name = email.split('@')[0]
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
      
    setUser({
      name,
      email,
      avatarUrl: `https://i.pravatar.cc/100?u=${email}`,
    });
    setCurrentPage(Page.Dashboard);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage(Page.Dashboard);
  };

  const handlePlanCreated = (plan: StudyPlan) => {
    setStudyPlans(prev => [plan, ...prev]);
    setCurrentPage(Page.Planner);
  };
  
  const handleUpdatePlan = (updatedPlan: StudyPlan) => {
      setStudyPlans(prevPlans => prevPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };
  
  const handleStartQuiz = (topic: string) => {
    setQuizTopic(topic);
    setCurrentPage(Page.BrainBuzz);
  };

  const handleNavigate = (page: Page) => {
      setCurrentPage(page);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
  };

  const renderPage = () => {
    if (!user) return null; // Should not happen due to the check below
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard user={user} plans={studyPlans} onNavigate={setCurrentPage} />;
      case Page.Planner:
        return <StudyPlanView plans={studyPlans} updatePlan={handleUpdatePlan} onNavigate={() => setCurrentPage(Page.NewPlan)} onStartQuiz={handleStartQuiz} />;
      case Page.NewPlan:
        return <StudyPlannerCreator onPlanCreated={handlePlanCreated} />;
      case Page.BrainBuzz:
        return <BrainBuzz plans={studyPlans} initialTopic={quizTopic} onQuizFinished={() => setQuizTopic(null)} />;
      case Page.AiAssistant:
        return <AiAssistant user={user} />;
      default:
        return <Dashboard user={user} plans={studyPlans} onNavigate={setCurrentPage} />;
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
         <header className="flex md:hidden items-center justify-between p-4 bg-base-200 border-b border-base-300">
            <h1 className="text-lg font-bold">AI Planner</h1>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </header>
        <div className="flex-1 overflow-y-auto">
            {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;