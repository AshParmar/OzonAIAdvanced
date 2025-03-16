import React, { useState } from 'react';
import { Search, Code2, Shield, Brain, Database, Smartphone, ChevronRight, Trophy, Sparkles } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface Course {
  id: string;
  title: string;
  platform: string;
  xp: number;
  level: string;
  duration: string;
}

function App() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [xpProgress, setXpProgress] = useState(0);
  const [showUnlockMessage, setShowUnlockMessage] = useState(false);

  const skills: Skill[] = [
    { id: 'webdev', name: 'Web Development', icon: <Code2 className="w-15 h-15" />, color: 'bg-blue-500' },
    { id: 'cyber', name: 'Cybersecurity', icon: <Shield className="w-15 h-15" />, color: 'bg-red-500' },
    { id: 'ai', name: 'Artificial Intelligence', icon: <Brain className="w-15 h-15" />, color: 'bg-purple-500' },
    { id: 'data', name: 'Data Science', icon: <Database className="w-15 h-15" />, color: 'bg-green-500' },
    { id: 'mobile', name: 'Mobile Development', icon: <Smartphone className="w-15 h-15" />, color: 'bg-yellow-500' },
  ];

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced Machine Learning',
      platform: 'Coursera',
      xp: 500,
      level: 'Advanced',
      duration: '12 weeks'
    },
    {
      id: '2',
      title: 'Full Stack Development',
      platform: 'Udemy',
      xp: 400,
      level: 'Intermediate',
      duration: '8 weeks'
    },
    {
      id: '3',
      title: 'Cybersecurity Fundamentals',
      platform: 'edX',
      xp: 300,
      level: 'Basic',
      duration: '6 weeks'
    },
  ];

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
    setXpProgress(33);
  };

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
    setXpProgress(66);
  };

  const handleGetRecommendations = () => {
    setShowResults(true);
    setXpProgress(100);
    setShowUnlockMessage(true);
    setTimeout(() => setShowUnlockMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-12 mt-10">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for skills..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="h-4 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-300">
          <span>Choose Skill</span>
          <span>Select Level</span>
          <span>Get Results</span>
        </div>
      </div>

      {/* Unlock Message */}
      {showUnlockMessage && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span>Congratulations! You've unlocked a new skill path!</span>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <section className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          Choose Your Skill
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillSelect(skill.id)}
              className={`${
                selectedSkill === skill.id ? `${skill.color} ring-4 ring-white/50` : 'bg-white/10 hover:bg-white/20'
              } p-6 rounded-xl transition-all duration-300 backdrop-blur-sm flex flex-col items-center gap-3`}
            >
              {skill.icon}
              <span className="text-sm font-medium">{skill.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Level Selection */}
      {selectedSkill && (
        <section className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6">Select Your Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Basic', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className={`${
                  selectedLevel === level
                    ? 'bg-purple-500 ring-4 ring-purple-300/50'
                    : 'bg-white/10 hover:bg-white/20'
                } p-6 rounded-xl transition-all duration-300`}
              >
                <h3 className="text-xl font-semibold mb-2">{level}</h3>
                <p className="text-sm text-gray-300">
                  {level === 'Basic' && 'Perfect for beginners'}
                  {level === 'Intermediate' && 'Build on your knowledge'}
                  {level === 'Advanced' && 'Master your skills'}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Get Recommendations Button */}
      {selectedSkill && selectedLevel && !showResults && (
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <button
            onClick={handleGetRecommendations}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-bold
              hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300
              animate-pulse hover:animate-none flex items-center gap-2 mx-auto"
          >
            Get Recommendations
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{course.title}</h3>
                  <span className="bg-purple-500 px-3 py-1 rounded-full text-sm">+{course.xp} XP</span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-1">Platform: {course.platform}</p>
                  <p className="text-gray-300 text-sm mb-1">Level: {course.level}</p>
                  <p className="text-gray-300 text-sm">Duration: {course.duration}</p>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg
                  hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;