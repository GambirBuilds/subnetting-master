/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LessonViewer } from './components/learning/LessonViewer';
import { SubnetCalculator } from './components/calculator/SubnetCalculator';
import { CidrSliderVisualizer } from './components/calculator/CidrSliderVisualizer';
import { BinaryConverter } from './components/binary/BinaryConverter';
import { VlsmLab } from './components/vlsm/VlsmLab';
import { NetworkRepairLab } from './components/network/NetworkRepairLab';
import { SubnetWars } from './components/game/SubnetWars';
import { DailyChallenge } from './components/game/DailyChallenge';
import { QuizEngine } from './components/quiz/QuizEngine';
import { ExamSimulator } from './components/exam/ExamSimulator';
import { CheatSheet } from './components/reference/CheatSheet';
import { AdminPanel } from './components/admin/AdminPanel';
import { SmartSearchModal } from './components/search/SmartSearchModal';
import { ToolsSuite } from './components/tools/ToolsSuite';
import { NetworkBuilder } from './components/simulator/NetworkBuilder';
import { PacketJourney } from './components/simulator/PacketJourney';
import { NetworkCli } from './components/simulator/NetworkCli';
import { FlashcardsHub } from './components/practice/FlashcardsHub';
import { CareerPath } from './components/career/CareerPath';
import { CertificateHub } from './components/certificates/CertificateHub';
import { ProtocolExplorer } from './components/reference/ProtocolExplorer';
import { AiMentor } from './components/mentor/AiMentor';
import { CheckCircle2, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notification, clearNotification, currentPalette } = useApp();

  // Auto clear notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => clearNotification(), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  return (
    <div className={`min-h-screen ${currentPalette.bgLightClass} ${currentPalette.bgDarkClass} text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300`}>
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        {activeTab === 'dashboard' && <StudentDashboard />}
        {activeTab === 'learn' && <LessonViewer />}
        {activeTab === 'tools' && <ToolsSuite />}
        {activeTab === 'simulator' && <NetworkBuilder />}
        {activeTab === 'packet-journey' && <PacketJourney />}
        {activeTab === 'cli' && <NetworkCli />}
        {activeTab === 'network-lab' && <NetworkRepairLab />}
        {activeTab === 'flashcards' && <FlashcardsHub />}
        {activeTab === 'career' && <CareerPath />}
        {activeTab === 'certificates' && <CertificateHub />}
        {activeTab === 'protocols' && <ProtocolExplorer />}
        {activeTab === 'ai-mentor' && <AiMentor />}
        {activeTab === 'calculator' && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <SubnetCalculator />
            <CidrSliderVisualizer />
          </div>
        )}
        {activeTab === 'binary' && <BinaryConverter />}
        {activeTab === 'vlsm' && <VlsmLab />}
        {activeTab === 'subnet-wars' && <SubnetWars />}
        {activeTab === 'daily' && <DailyChallenge />}
        {activeTab === 'quiz' && <QuizEngine />}
        {activeTab === 'exam' && <ExamSimulator />}
        {activeTab === 'cheatsheet' && <CheatSheet />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-cyan-500/40 shadow-xl dark:shadow-2xl flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{notification.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{notification.desc}</p>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Command/Search Palette (⌘K) */}
      <SmartSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
