import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiPlay, FiChevronDown } from 'react-icons/fi';
import { FiSearch, FiCalendar, FiFileText, FiClock } from 'react-icons/fi';

interface ToolPanelProps {
  onClose: () => void;
}

interface Tool {
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  parameters?: string[];
}

export default function ToolPanel({ onClose }: ToolPanelProps) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      name: 'Web Search',
      description: 'Search the internet for information',
      icon: <FiSearch className="text-blue-400" size={20} />,
      category: 'Information',
      parameters: ['query'],
    },
    {
      name: 'Schedule Calendar',
      description: 'Add events to your calendar',
      icon: <FiCalendar className="text-red-400" size={20} />,
      category: 'Calendar',
      parameters: ['title', 'date', 'time', 'duration'],
    },
    {
      name: 'List Calendar Events',
      description: 'View upcoming calendar events',
      icon: <FiClock className="text-yellow-400" size={20} />,
      category: 'Calendar',
      parameters: [],
    },
    {
      name: 'Read Excel',
      description: 'Read data from Excel files',
      icon: <FiFileText className="text-green-400" size={20} />,
      category: 'Files',
      parameters: ['file_path', 'sheet_name'],
    },
    {
      name: 'Write Excel',
      description: 'Write data to Excel files',
      icon: <FiFileText className="text-green-400" size={20} />,
      category: 'Files',
      parameters: ['file_path', 'data', 'sheet_name'],
    },
  ];

  const panelVariants = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 300, opacity: 0, transition: { duration: 0.2 } },
  };

  const toolVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    hover: { x: 4 },
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <motion.div
      variants={panelVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-72 bg-dark-surface border-l border-dark-border flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 bg-dark-surface-alt border-b border-dark-border flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-dark-text">Available Tools</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-dark-border rounded-lg transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Tools List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="space-y-2">
              {categoryTools.map((tool, idx) => (
                <motion.div
                  key={idx}
                  variants={toolVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  className="p-3 rounded-lg bg-dark-bg border border-dark-border hover:border-dark-accent transition-colors cursor-pointer"
                  onClick={() =>
                    setExpandedTool(expandedTool === tool.name ? null : tool.name)
                  }
                >
                  {/* Tool Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-dark-surface mt-0.5">
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-dark-text text-sm">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-dark-text-muted mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedTool === tool.name ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown size={16} className="text-dark-accent" />
                    </motion.div>
                  </div>

                  {/* Expanded Details */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: expandedTool === tool.name ? 'auto' : 0,
                      opacity: expandedTool === tool.name ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-dark-border">
                      {tool.parameters && tool.parameters.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          <p className="text-xs font-semibold text-dark-text-muted uppercase">
                            Parameters
                          </p>
                          <div className="space-y-1">
                            {tool.parameters.map((param) => (
                              <div
                                key={param}
                                className="flex items-center gap-2 text-xs"
                              >
                                <div className="w-1 h-1 rounded-full bg-dark-accent" />
                                <span className="text-dark-text-muted">{param}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-dark-text-muted mb-3">
                          No parameters required
                        </p>
                      )}

                      <button className="w-full px-3 py-2 rounded-lg bg-dark-accent hover:bg-dark-accent-hover text-white text-xs font-medium transition-colors flex items-center justify-center gap-2">
                        <FiPlay size={12} />
                        Execute
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="h-16 bg-dark-surface-alt border-t border-dark-border p-4 text-xs text-dark-text-muted">
        <p>Click a tool to see details and execute it.</p>
      </div>
    </motion.div>
  );
}
