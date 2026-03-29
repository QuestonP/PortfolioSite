import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Package, TrendingUp, AlertTriangle, DollarSign, Clock, Truck, Factory, Store, ChevronRight, PlayCircle, PauseCircle, BarChart3, Settings, Award } from 'lucide-react';

const STAGES = [
  { id: 'raw', name: 'Raw Materials', icon: Package, time: 2, cost: 100 },
  { id: 'manufacturing', name: 'Manufacturing', icon: Factory, time: 5, cost: 300 },
  { id: 'warehouse', name: 'Warehousing', icon: Package, time: 1, cost: 50 },
  { id: 'distribution', name: 'Distribution', icon: Truck, time: 3, cost: 150 },
  { id: 'retail', name: 'Retail', icon: Store, time: 1, cost: 100 }
];

const DISRUPTIONS = [
  { id: 'delay', name: 'Supplier Delay', stage: 'raw', impact: 'time', value: 3, probability: 0.05 },
  { id: 'quality', name: 'Quality Issue', stage: 'manufacturing', impact: 'cost', value: 200, probability: 0.01 },
  { id: 'breakdown', name: 'Equipment Breakdown', stage: 'manufacturing', impact: 'time', value: 4, probability: 0.012 },
  { id: 'traffic', name: 'Traffic Jam', stage: 'distribution', impact: 'time', value: 2, probability: 0.02 },
  { id: 'shortage', name: 'Labor Shortage', stage: 'warehouse', impact: 'cost', value: 100, probability: 0.08 },
  { id: 'weather', name: 'Severe Weather', stage: 'distribution', impact: 'time', value: 5, probability: 0.05 }
];

const MITIGATION_STRATEGIES = {
  delay: [
    { name: 'Diversify Suppliers', cost: 500, effectiveness: 0.7, future: true },
    { name: 'Emergency Air Freight', cost: 800, effectiveness: 0.9, future: false }
  ],
  quality: [
    { name: 'Enhanced QA Process', cost: 400, effectiveness: 0.8, future: true },
    { name: 'Rework Product', cost: 300, effectiveness: 0.6, future: false }
  ],
  breakdown: [
    { name: 'Preventive Maintenance', cost: 600, effectiveness: 0.75, future: true },
    { name: 'Rent Equipment', cost: 700, effectiveness: 0.85, future: false }
  ],
  traffic: [
    { name: 'Route Optimization', cost: 300, effectiveness: 0.65, future: true },
    { name: 'Alternative Carrier', cost: 500, effectiveness: 0.8, future: false }
  ],
  shortage: [
    { name: 'Hire Temp Workers', cost: 400, effectiveness: 0.7, future: false },
    { name: 'Automation Investment', cost: 1000, effectiveness: 0.9, future: true }
  ],
  weather: [
    { name: 'Weather Insurance', cost: 350, effectiveness: 0.6, future: true },
    { name: 'Delay Shipment', cost: 200, effectiveness: 0.5, future: false }
  ]
};

const SupplyChainGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [products, setProducts] = useState([]);
  const [completedProducts, setCompletedProducts] = useState([]);
  const [budget, setBudget] = useState(10000);
  const [revenue, setRevenue] = useState(0);
  const [day, setDay] = useState(1);
  const [speed, setSpeed] = useState(1000);
  const [activeDisruptions, setActiveDisruptions] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    avgLeadTime: 0,
    totalCost: 0,
    disruptionsHandled: 0,
    efficiency: 100
  });
  const [showDisruptionModal, setShowDisruptionModal] = useState(null);
  const [productIdCounter, setProductIdCounter] = useState(1);

  const startNewProduct = useCallback(() => {
    if (budget >= STAGES[0].cost) {
      const newProduct = {
        id: productIdCounter,
        stage: 0,
        progress: 0,
        startDay: day,
        totalCost: 0,
        delays: 0,
        disruptions: []
      };
      setProducts(prev => [...prev, newProduct]);
      setProductIdCounter(prev => prev + 1);
      setBudget(prev => prev - STAGES[0].cost);
    }
  }, [budget, day, productIdCounter]);

  const checkForDisruptions = useCallback((product) => {
    const currentStage = STAGES[product.stage];
    const relevantDisruptions = DISRUPTIONS.filter(d => d.stage === currentStage.id);
    
    for (const disruption of relevantDisruptions) {
      const mitigated = mitigations.some(m => m.disruptionId === disruption.id && m.future);
      const effectiveProb = mitigated ? disruption.probability * 0.3 : disruption.probability;
      
      if (Math.random() < effectiveProb) {
        return disruption;
      }
    }
    return null;
  }, [mitigations]);

  const handleMitigation = (disruption, strategy) => {
    if (budget >= strategy.cost) {
      setBudget(prev => prev - strategy.cost);
      
      const effectiveness = Math.random() < strategy.effectiveness;
      
      if (strategy.future) {
        setMitigations(prev => [...prev, {
          disruptionId: disruption.id,
          strategy: strategy.name,
          day: day
        }]);
      }

      setProducts(prev => prev.map(p => 
        p.id === showDisruptionModal.productId ? {
          ...p,
          disruptions: [...p.disruptions, {
            ...disruption,
            mitigated: effectiveness,
            strategy: strategy.name,
            day: day
          }]
        } : p
      ));

      if (!effectiveness && disruption.impact === 'time') {
        setProducts(prev => prev.map(p => 
          p.id === showDisruptionModal.productId ? {
            ...p,
            delays: p.delays + Math.ceil(disruption.value * 0.3)
          } : p
        ));
      } else if (!effectiveness && disruption.impact === 'cost') {
        setBudget(prev => prev - Math.ceil(disruption.value * 0.3));
      }

      setStats(prev => ({
        ...prev,
        disruptionsHandled: prev.disruptionsHandled + 1
      }));

      setShowDisruptionModal(null);
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setDay(prev => prev + 1);
      
      setProducts(prev => {
        const updated = prev.map(product => {
          const currentStage = STAGES[product.stage];
          let newProgress = product.progress + (1 / currentStage.time);
          
          if (product.delays > 0) {
            return { ...product, delays: product.delays - 1 };
          }

          if (newProgress >= 1) {
            const nextStage = product.stage + 1;
            
            if (nextStage >= STAGES.length) {
              const leadTime = day - product.startDay;
              const productRevenue = 1500;
              setRevenue(prev => prev + productRevenue);
              setBudget(prev => prev + productRevenue);
              
              setCompletedProducts(prevCompleted => [...prevCompleted, {
                ...product,
                completedDay: day,
                leadTime: leadTime
              }]);

              setStats(prev => ({
                totalProducts: prev.totalProducts + 1,
                avgLeadTime: ((prev.avgLeadTime * prev.totalProducts) + leadTime) / (prev.totalProducts + 1),
                totalCost: prev.totalCost + product.totalCost + currentStage.cost,
                disruptionsHandled: prev.disruptionsHandled,
                efficiency: Math.max(50, 100 - (product.disruptions.length * 5))
              }));

              return null;
            }

            const disruption = checkForDisruptions(product);
            if (disruption && !showDisruptionModal) {
              setShowDisruptionModal({ disruption, productId: product.id });
              setActiveDisruptions(prev => [...prev, { ...disruption, productId: product.id, day }]);
            }

            const nextStageCost = STAGES[nextStage].cost;
            setBudget(prevBudget => prevBudget - nextStageCost);

            return {
              ...product,
              stage: nextStage,
              progress: 0,
              totalCost: product.totalCost + currentStage.cost
            };
          }

          return { ...product, progress: newProgress };
        }).filter(Boolean);

        return updated;
      });

      if (day % 3 === 0 && budget > 1000) {
        startNewProduct();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, day, speed, budget, checkForDisruptions, showDisruptionModal, startNewProduct]);

  const getStageColor = (stage) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[stage] || '#6b7280';
  };

  const performanceData = completedProducts.slice(-10).map((p, i) => ({
    product: `P${p.id}`,
    leadTime: p.leadTime,
    cost: p.totalCost,
    disruptions: p.disruptions.length
  }));

  const stageDistribution = products.reduce((acc, p) => {
    const stageName = STAGES[p.stage].name;
    acc[stageName] = (acc[stageName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(stageDistribution).map(([name, value]) => ({
    name, value
  }));

  const disruptionHistory = activeDisruptions.slice(-15).map(d => ({
    day: d.day,
    type: d.name,
    stage: STAGES.find(s => s.id === d.stage)?.name
  }));

  const MenuItem = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
      <Icon className="w-16 h-16 mb-4" />
      <h3 className="text-2xl font-bold">{label}</h3>
    </button>
  );

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Supply Chain Simulator
            </h1>
            <p className="text-xl text-gray-300">Master the art of supply chain management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MenuItem 
              icon={PlayCircle} 
              label="Start Game" 
              onClick={() => setGameState('playing')}
              color="blue"
            />
            <MenuItem 
              icon={BarChart3} 
              label="Analytics" 
              onClick={() => setGameState('analytics')}
              color="purple"
            />
            <MenuItem 
              icon={Award} 
              label="Achievements" 
              onClick={() => alert('Achievements coming soon!')}
              color="pink"
            />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-3">🎯 Objective</h3>
              <p className="text-gray-300">Manage products through 5 supply chain stages while handling disruptions and maximizing profit</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-3">💡 Features</h3>
              <p className="text-gray-300">Real-time analytics, randomized disruptions, strategic decision-making, and performance tracking</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Supply Chain Analytics</h1>
            <button
              onClick={() => setGameState('menu')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Menu
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Products</p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                </div>
                <Package className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Avg Lead Time</p>
                  <p className="text-3xl font-bold">{stats.avgLeadTime.toFixed(1)} days</p>
                </div>
                <Clock className="w-12 h-12 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Cost</p>
                  <p className="text-3xl font-bold">${stats.totalCost}</p>
                </div>
                <DollarSign className="w-12 h-12 text-pink-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Efficiency</p>
                  <p className="text-3xl font-bold">{stats.efficiency.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Product Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="product" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="leadTime" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Cost Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="product" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="cost" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Disruption Timeline</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3">Day</th>
                    <th className="text-left p-3">Disruption Type</th>
                    <th className="text-left p-3">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {disruptionHistory.map((d, i) => (
                    <tr key={i} className="border-b border-gray-800 hover:bg-white/5">
                      <td className="p-3">{d.day}</td>
                      <td className="p-3">{d.type}</td>
                      <td className="p-3">{d.stage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Supply Chain Command Center</h1>
            <p className="text-gray-300">Day {day} | Products in Pipeline: {products.length}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {gameState === 'playing' ? <PauseCircle /> : <PlayCircle />}
              {gameState === 'playing' ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => setGameState('analytics')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <BarChart3 />
              Analytics
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Menu
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Budget</p>
                <p className="text-2xl font-bold">${budget}</p>
              </div>
              <DollarSign className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Revenue</p>
                <p className="text-2xl font-bold">${revenue}</p>
              </div>
              <TrendingUp className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Completed</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Avg Lead Time</p>
                <p className="text-2xl font-bold">{stats.avgLeadTime.toFixed(1)}d</p>
              </div>
              <Clock className="w-10 h-10 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Efficiency</p>
                <p className="text-2xl font-bold">{stats.efficiency.toFixed(0)}%</p>
              </div>
              <Award className="w-10 h-10 opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Truck className="w-7 h-7" />
            Live Supply Chain Flow
          </h2>
          
          <div className="relative">
            <div className="flex justify-between mb-8">
              {STAGES.map((stage, idx) => {
                const StageIcon = stage.icon;
                const gradients = [
                  'from-blue-400 to-blue-500',
                  'from-purple-400 to-purple-500',
                  'from-pink-400 to-pink-500',
                  'from-orange-400 to-orange-500',
                  'from-green-400 to-green-500'
                ];
                return (
                  <div key={stage.id} className="flex-1 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${gradients[idx]} shadow-lg mb-2`}>
                      <StageIcon className="w-8 h-8" />
                    </div>
                    <p className="font-semibold">{stage.name}</p>
                    <p className="text-sm text-gray-400">{stage.time}d | ${stage.cost}</p>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-green-500 opacity-30" style={{ width: 'calc(100% - 4rem)', marginLeft: '2rem' }} />

            <div className="space-y-2 min-h-[200px]">
              {products.map(product => {
                const position = (product.stage / (STAGES.length - 1)) * 100;
                
                return (
                  <div key={product.id} className="relative h-12">
                    <div 
                      className="absolute top-0 transition-all duration-1000 ease-linear"
                      style={{ left: `${position}%` }}
                    >
                      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${
                        product.delays > 0 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                      } shadow-lg`}>
                        <Package className="w-6 h-6" />
                        {product.delays > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                            !
                          </div>
                        )}
                      </div>
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-black/80 px-2 py-1 rounded text-xs">
                          P{product.id} | {(product.progress * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Stage Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStageColor(index)} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Active Mitigations</h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {mitigations.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No active mitigations</p>
              ) : (
                mitigations.map((m, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{m.strategy}</p>
                      <p className="text-sm text-gray-400">Implemented Day {m.day}</p>
                    </div>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showDisruptionModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-red-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Disruption Alert!</h2>
                  <p className="text-xl text-red-400 font-semibold">{showDisruptionModal.disruption.name}</p>
                  <p className="text-gray-300 mt-2">
                    Product P{showDisruptionModal.productId} is experiencing a disruption at the{' '}
                    {STAGES.find(s => s.id === showDisruptionModal.disruption.stage)?.name} stage.
                  </p>
                  <p className="text-gray-400 mt-1">
                    Impact: {showDisruptionModal.disruption.impact === 'time' ? `+${showDisruptionModal.disruption.value} days delay` : `${showDisruptionModal.disruption.value} additional cost`}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Choose a Mitigation Strategy:</h3>
                <div className="space-y-3">
                  {MITIGATION_STRATEGIES[showDisruptionModal.disruption.id]?.map((strategy, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMitigation(showDisruptionModal.disruption, strategy)}
                      disabled={budget < strategy.cost}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        budget >= strategy.cost
                          ? 'bg-white/10 hover:bg-white/20 border-2 border-transparent hover:border-blue-400'
                          : 'bg-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{strategy.name}</h4>
                        <span className="text-yellow-400 font-semibold">${strategy.cost}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">
                          {(strategy.effectiveness * 100).toFixed(0)}% effectiveness
                        </span>
                        <span className="text-blue-400">
                          {strategy.future ? '🛡️ Prevents future occurrences' : '⚡ Immediate action'}
                        </span>
                      </div>
                      {budget < strategy.cost && (
                        <p className="text-red-400 text-sm mt-2">Insufficient budget</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDisruptionModal(null);
                  setProducts(prev => prev.map(p => 
                    p.id === showDisruptionModal.productId ? {
                      ...p,
                      delays: p.delays + showDisruptionModal.disruption.value,
                      disruptions: [...p.disruptions, { ...showDisruptionModal.disruption, mitigated: false, day }]
                    } : p
                  ));
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Accept Disruption (No Action)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainGame;