import create from 'zustand';
import axios from 'axios';

export interface Tool {
  name: string;
  description: string;
}

export interface AgentStatus {
  healthy: boolean;
  model: string;
  version: string;
  tools: Tool[];
  memory_size: number;
}

interface AgentStore {
  agentStatus: AgentStatus | null;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  clearError: () => void;
}

export const useStore = create<AgentStore>((set) => ({
  agentStatus: null,
  isLoading: false,
  error: null,

  refreshStatus: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get<AgentStatus>(
        'http://localhost:8000/status'
      );
      set({ agentStatus: response.data, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch status',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
