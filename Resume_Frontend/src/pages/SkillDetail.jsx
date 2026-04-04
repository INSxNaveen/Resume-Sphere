import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DotPatternBackground from '../components/DotPatternBackground';
import TiltCard from '../components/TiltCard';
import PrimaryButton from '../components/PrimaryButton';
import { getResourcesForSkill } from '../services/api';

const skillData = {
  'Docker': {
    steps: ['Containerization Basics', 'Dockerfile Mastery', 'Network Architecture', 'Docker Compose Orchestration', 'Production Deployment', 'Security Hardening'],
    videos: [
      { title: 'Docker Full Course (Beginner to Pro)', url: 'https://www.youtube.com/results?search_query=docker+tutorial+full+course' },
      { title: 'Docker Networking Deep Dive', url: 'https://www.youtube.com/results?search_query=docker+networking+tutorial' },
      { title: 'Docker Compose for Microservices', url: 'https://www.youtube.com/results?search_query=docker+compose+advanced' },
      { title: 'Production Docker Security', url: 'https://www.youtube.com/results?search_query=docker+security+best+practices' },
      { title: 'Docker Internals & Namespaces', url: 'https://www.youtube.com/results?search_query=docker+internals+explained' }
    ],
    documents: [
      { title: 'Official Docker Reference Hub', url: 'https://docs.docker.com/reference/' },
      { title: 'Dockerfile Best Practices Guide', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/' },
      { title: 'Docker Bench for Security', url: 'https://github.com/docker/docker-bench-security' },
      { title: 'Multi-stage Builds Mastery', url: 'https://docs.docker.com/build/building/multi-stage/' },
      { title: 'Container Resource Constraints', url: 'https://docs.docker.com/config/containers/resource_constraints/' }
    ],
    projects: [
      { title: 'Full-stack Container Hub', desc: 'Build a production-ready MERN/PERN stack fully containerized with automated scaling.' },
      { title: 'Custom Docker Registry', desc: 'Deploy and manage your own private image registry with SSL and Auth.' },
      { title: 'CI/CD Pipeline with Docker', desc: 'Build a Github Actions workflow that builds, scans, and pushes images.' },
      { title: 'Zero-Downtime Deployment', desc: 'Use Docker Swarm or Compose to update apps with no user disruption.' },
      { title: 'Sidecar Pattern Implementation', desc: 'Implement logging and monitoring using the sidecar container pattern.' }
    ]
  },
  'Redis': {
    steps: ['Data Models & Types', 'Persistence Mechanisms', 'Caching & Eviction', 'Pub/Sub Real-time', 'Redis Streams', 'High Availability Clusters'],
    videos: [
      { title: 'Redis Crash Course (2024)', url: 'https://www.youtube.com/results?search_query=redis+crash+course' },
      { title: 'Redis Streams & Pub/Sub', url: 'https://www.youtube.com/results?search_query=redis+streams+tutorial' },
      { title: 'Caching Strategies with Redis', url: 'https://www.youtube.com/results?search_query=redis+caching+patterns' },
      { title: 'Redis Cluster Setup Guide', url: 'https://www.youtube.com/results?search_query=redis+cluster+tutorial' },
      { title: 'Redlock & Distributed Locks', url: 'https://www.youtube.com/results?search_query=redis+distributed+lock' }
    ],
    documents: [
      { title: 'Official Data Types Docs', url: 'https://redis.io/docs/data-types/' },
      { title: 'Persistence Options (RDB vs AOF)', url: 'https://redis.io/docs/management/persistence/' },
      { title: 'RediSearch & Vector Similarity', url: 'https://redis.io/docs/stack/search/' },
      { title: 'High Availability with Sentinel', url: 'https://redis.io/docs/management/sentinel/' },
      { title: 'Redis API Reference (Node.js)', url: 'https://github.com/redis/node-redis' }
    ],
    projects: [
      { title: 'Real-time Chat Engine', desc: 'Build a scalable chat application using Redis Pub/Sub for instant messaging.' },
      { title: 'Distributed Rate Limiter', desc: 'Implement a sliding-window rate limiter to protect APIs from abuse.' },
      { title: 'E-commerce Shopping Cart', desc: 'Use Redis hashes to manage fast, temporary shopping sessions.' },
      { title: 'Gaming Leaderboard System', desc: 'Implement a global leaderboard using Redis Sorted Sets (ZSET).' },
      { title: 'AI Semantic Search with Redis', desc: 'Implement vector search for resume matching using Redis Stack.' }
    ]
  },
  'Kubernetes': {
    steps: ['Control Plane Architecture', 'Workload Orchestration', 'ConfigMaps & Secrets', 'Ingress Control', 'Helm Package Management', 'Monitoring & Ops'],
    videos: [
      { title: 'Kubernetes for Absolute Beginners', url: 'https://www.youtube.com/results?search_query=kubernetes+for+beginners' },
      { title: 'Ingress Controllers Explained', url: 'https://www.youtube.com/results?search_query=kubernetes+ingress+tutorial' },
      { title: 'Helm V3 Masterclass', url: 'https://www.youtube.com/results?search_query=helm+tutorial' },
      { title: 'Kubernetes Operators Patterns', url: 'https://www.youtube.com/results?search_query=kubernetes+operators' },
      { title: 'Service Mesh (Istio/Linkerd)', url: 'https://www.youtube.com/results?search_query=istio+service+mesh' }
    ],
    documents: [
      { title: 'The Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/' },
      { title: 'K8s Hardening Guide (NSA)', url: 'https://www.nsa.gov/Portals/70/documents/what-we-do/cybersecurity/advisories/k8s_security_guide.pdf' },
      { title: 'Helm Charts Repository', url: 'https://artifacthub.io/' },
      { title: 'Kubernetes API Reference', url: 'https://kubernetes.io/docs/reference/' },
      { title: 'Cloud Native Landscape', url: 'https://landscape.cncf.io/' }
    ],
    projects: [
      { title: 'Auto-Scaling Microservices', desc: 'Deploy an app with Horizontal Pod Autoscaling (HPA) based on CPU/RAM.' },
      { title: 'Blue-Green Deployment Engine', desc: 'Build an automated bridge for zero-downtime rolling releases.' },
      { title: 'Self-Healing K8s Infrastructure', desc: 'Implement custom health checks and liveness probes for resilience.' },
      { title: 'Cross-Cloud Deploy Hub', desc: 'Deploy the same stack across Minikube, GKE, and EKS using Helm.' },
      { title: 'Logging & Metrics Stack', desc: 'Deploy Prometheus and Grafana to monitor your K8s cluster health.' }
    ]
  },
  'React': {
    steps: ['Component Lifecycle', 'Advanced Hooks (useMemo/Callback)', 'Global State Orchestration', 'Performance Profiling', 'Next.js App Router', 'Enterprise UI Kits'],
    videos: [
      { title: 'Mastering React Performance', url: 'https://www.youtube.com/results?search_query=react+performance+profiling' },
      { title: 'React Design Patterns 2024', url: 'https://www.youtube.com/results?search_query=react+patterns+clean+code' },
      { title: 'Server Components Deep Dive', url: 'https://www.youtube.com/results?search_query=react+server+components' },
      { title: 'Zustand vs Redux Toolkit', url: 'https://www.youtube.com/results?search_query=zustand+tutorial' },
      { title: 'Framer Motion 3D & Animations', url: 'https://www.youtube.com/results?search_query=framer+motion+advanced' }
    ],
    documents: [
      { title: 'React Server Components RFC', url: 'https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md' },
      { title: 'Patterns.dev: React Design', url: 'https://www.patterns.dev/posts/react-patterns' },
      { title: 'Tailwind CSS for Scale', url: 'https://tailwindcss.com/docs/utility-first' },
      { title: 'TanStack Query Masterguide', url: 'https://tanstack.com/query/latest/docs/react/overview' },
      { title: 'React TypeScript Cheatsheet', url: 'https://react-typescript-cheatsheet.netlify.app/' }
    ],
    projects: [
      { title: 'Highly-Animated SaaS UI', desc: 'Build a futuristic dashboard with Framer Motion and real-time websockets.' },
      { title: 'Collaborative Code Editor', desc: 'Build a real-time editor using YJS/CRDTs and React frontend.' },
      { title: 'Complex Data Grid System', desc: 'Implement an virtualized grid handling 100k+ rows with sorting and filters.' },
      { title: 'AI-Powered Content Engine', desc: 'Integrate OpenAI/Claude SDKs into a Next.js full-stack CMS.' },
      { title: 'Atomic Design UI Library', desc: 'Create a reusable, documented design system using Storybook and React.' }
    ]
  }
};

/**
 * SkillDetail Page
 * Shows the roadmap, videos, and projects for a specific skill.
 * When a user clicks on a missing skill (like 'Docker'), this page teaches them.
 * Videos and articles are loaded live from the backend API.
 * The roadmap steps and projects use curated hardcoded data as the backend doesn't provide them.
 */
const SkillDetail = () => {
  const { skillName } = useParams();
  const navigate = useNavigate();

  // Loading state while fetching resources from backend
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  // Live resources from the backend API (YouTube + article links)
  const [liveResources, setLiveResources] = useState(null);

  // Fetch live resources from the backend when the page loads
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);
      try {
        const response = await getResourcesForSkill(skillName);
        // Backend returns: { youTubeLinks: [{title, url}], articleLinks: [{title, url}] }
        if (response.data && (response.data.youTubeLinks?.length > 0 || response.data.articleLinks?.length > 0)) {
          setLiveResources(response.data);
        }
      } catch (err) {
        // If API call fails, liveResources remains null → falls back to hardcoded data below
        console.warn(`Could not fetch resources for ${skillName} from backend:`, err.message);
      } finally {
        setIsLoadingResources(false);
      }
    };
    fetchResources();
  }, [skillName]);

  // Look up curated roadmap/projects from our hardcoded dictionary (API doesn't provide these)
  const details = skillData[skillName] || {
    steps: ['Foundations', 'Syntax & Core logic', 'Intermediate patterns', 'Advanced strategies', 'Production Grade Solutions'],
    videos: [
      { title: `${skillName} Mastering Course`, url: `https://www.youtube.com/results?search_query=${skillName}+mastery` },
      { title: `Building with ${skillName}`, url: `https://www.youtube.com/results?search_query=${skillName}+practical` }
    ],
    documents: [
      { title: 'Interactive Documentation', url: `https://google.com/search?q=${skillName}+docs` },
      { title: 'Cheat Sheet & References', url: `https://google.com/search?q=${skillName}+cheatsheet` }
    ],
    projects: [
      { title: `World-Class ${skillName} System`, desc: `Architect a highly scalable and optimized system utilizing the full power of ${skillName}.` }
    ]
  };

  // Prefer live API data for videos/articles; fall back to hardcoded
  const videos = liveResources?.youTubeLinks?.length > 0
    ? liveResources.youTubeLinks
    : details.videos;
  const documents = liveResources?.articleLinks?.length > 0
    ? liveResources.articleLinks
    : details.documents;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 15 } }
  };

  return (
    <div className="relative min-h-screen pb-32 overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-inter selection:bg-blue-500/30 transition-colors duration-700">
      {/* Immersive Background */}
      <DotPatternBackground />
      
      {/* Decorative Neon Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-blue-600/10 blur-[150px] rounded-full dark:opacity-100 opacity-50" />
      <div className="absolute bottom-[10%] left-[-10%] w-[40vw] h-[40vh] bg-purple-600/10 blur-[150px] rounded-full dark:opacity-100 opacity-50" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Superior Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
           <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 p-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Strategic Mastery Pathway
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
              >
                {skillName}<span className="text-blue-500">.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 dark:text-gray-400 text-lg max-w-xl font-medium"
              >
                {liveResources?.summary ? (
                  liveResources.summary
                ) : (
                  <>Harnessing the full potential of <span className="text-slate-900 dark:text-white">{skillName}</span> through our highly-optimized curated curriculum.</>
                )}
              </motion.p>
           </div>
           
           <div className="flex gap-4">
             <PrimaryButton 
               to="/dashboard"
               className="px-12 py-5"
             >
               <span className="relative z-10 uppercase tracking-widest text-sm">Dashboard</span>
               <span className="relative z-10 text-xl">🚀</span>
             </PrimaryButton>
           </div>
        </div>

        {/* The Lightweight Timeline */}
        <section className="mb-32 relative">
           <div className="absolute -top-10 left-10 flex items-center gap-3 z-20">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-black uppercase tracking-widest opacity-80 italic text-slate-800 dark:text-white">Neural Pathways Visualization</h2>
           </div>
           
           <div className="flex flex-col gap-4 mt-12 bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10 backdrop-blur-md relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
             {details.steps.map((step, index) => (
               <motion.div 
                 key={index} 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="flex items-center gap-4 relative z-10"
               >
                 <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-black flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-10">{index + 1}</div>
                 <div className="flex-1 bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm font-bold text-slate-800 dark:text-white relative hover:border-blue-500/50 transition-colors">
                   {/* Connection Line */}
                   {index !== details.steps.length - 1 && (
                     <div className="absolute -bottom-6 -left-7 w-0.5 h-6 bg-blue-500/30"></div>
                   )}
                   {step}
                 </div>
               </motion.div>
             ))}
           </div>
        </section>

        {/* Resources Command Center */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* Column 1: Video Intelligence */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-8">
               <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-2xl text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">▶</div>
               <h3 className="text-2xl font-black tracking-tight uppercase text-slate-800 dark:text-white">Video Ops</h3>
               {liveResources && (
                 <span className="ml-auto text-[9px] font-black text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full uppercase tracking-widest">● Live</span>
               )}
            </div>
            
            <div className="space-y-4">
              {isLoadingResources ? (
                // Loading spinner while fetching from backend
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                </div>
              ) : (
                videos.map((video, i) => (
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all border-l-4 border-l-red-500/30 hover:border-l-red-500 shadow-lg dark:shadow-none"
                  >
                    <p className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest mb-1">Lesson {i+1}</p>
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{video.title}</span>
                    <div className="mt-4 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                        <span className="text-xs">→</span>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Tech Documentation */}
          <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-8">
               <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">📁</div>
               <h3 className="text-2xl font-black tracking-tight uppercase text-slate-800 dark:text-white">Archives</h3>
               {liveResources && (
                 <span className="ml-auto text-[9px] font-black text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full uppercase tracking-widest">● Live</span>
               )}
            </div>
            
            <div className="space-y-4">
              {isLoadingResources ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              ) : (
                documents.map((doc, i) => (
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all border-l-4 border-l-emerald-500/30 hover:border-l-emerald-500 shadow-lg dark:shadow-none"
                  >
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Artifact {i+1}</p>
                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{doc.title}</span>
                    <div className="mt-4 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-600 group-hover:text-white">
                        <span className="text-xs">↗</span>
                      </div>
                    </div>
                  </motion.a>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Alpha Labs (Projects) */}
          <div className="space-y-10">
             <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-8">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">☢️</div>
                <h3 className="text-2xl font-black tracking-tight uppercase text-slate-800 dark:text-white">Alpha Labs</h3>
             </div>
             
             <div className="space-y-6">
                {details.projects.map((project, i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className="p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-black border border-slate-200 dark:border-white/5 rounded-[32px] relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-xl dark:shadow-none"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                     <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] mb-4 block">Lab Node {i+1}</span>
                     <h4 className="text-xl font-black mb-3 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase italic">{project.title}</h4>
                     <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">{project.desc}</p>
                     <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                           {[1,2,3].map(s => <div key={s} className={`w-3 h-1 rounded-full ${i+1 >= s ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">DIFFICULTY: {i < 2 ? 'CORE' : 'ELITE'}</span>
                     </div>
                  </motion.div>
                 ))}
             </div>
          </div>
        </motion.div>
      </motion.div>
    </div>

  );
};

export default SkillDetail;
