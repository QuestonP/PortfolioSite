import React, { useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import { useStore } from './store/agentStore';

function App() {
  const { refreshStatus } = useStore();

  useEffect(() => {
    // Refresh status on mount and every 10 seconds
    refreshStatus();
    const interval = setInterval(refreshStatus, 10000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return (
    <div className="w-full h-screen bg-dark-bg">
      <ChatInterface />
    </div>
  );
}

export default App;
