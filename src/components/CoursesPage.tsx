import React, { useState, useEffect } from 'react';
import { Code, Shield, Brain, Database, Smartphone, Clock, RefreshCcw, Search, Star, ExternalLink, Tag, User } from 'lucide-react';
import axios from 'axios';

interface Course {
  course_title: string;
  course_organization: string;
  course_rating: number;
  course_url: string;
  course_skills: string[] | string;
  course_summary: string;
  course_difficulty: string;
  course_time: string;
  course_students_enrolled: string;
  course_description: string;
  course_certificate_type?: string;
  course_reviews_num?: number;
}

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  activeColor: string;
  description: string;
}

const skills: Skill[] = [
  {
    id: 'web',
    name: 'Web Development',
    icon: <Code className="w-8 h-8" />,
    activeColor: 'bg-purple-500',
    description: 'Learn to build modern web applications',
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    icon: <Shield className="w-8 h-8" />,
    activeColor: 'bg-red-500',
    description: 'Master digital security and ethical hacking',
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    icon: <Brain className="w-8 h-8" />,
    activeColor: 'bg-blue-500',
    description: 'Explore machine learning and AI concepts',
  },
  {
    id: 'data science',
    name: 'Data Science',
    icon: <Database className="w-8 h-8" />,
    activeColor: 'bg-green-500',
    description: 'Analyze and visualize complex data',
  },
  {
    id: 'machine learning',
    name: 'Machine Learning',
    icon: <Smartphone className="w-8 h-8" />,
    activeColor: 'bg-orange-500',
    description: 'Create apps for iOS and Android',
  },
];

const levels = [
  { 
    id: 'beginner', 
    name: 'Beginner', 
    description: 'Perfect for newcomers',
    color: 'from-green-400 to-emerald-500'
  },
  { 
    id: 'intermediate', 
    name: 'Intermediate', 
    description: 'Build on your knowledge',
    color: 'from-blue-400 to-indigo-500'
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    description: 'Master your skills',
    color: 'from-purple-400 to-pink-500'
  },
];

const durations = [
  { id: 'short', name: '1-4 weeks', description: 'Short and focused' },
  { id: 'medium', name: '1-3 months', description: 'Comprehensive learning' },
  { id: 'long', name: '3+ months', description: 'In-depth mastery' },
];

function App() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(prev => prev === skillId ? null : skillId);
    setSelectedLevel(null);
    setSelectedDuration(null);
    setRecommendations([]);
  };

  const handleLevelSelect = (levelId: string) => {
    setSelectedLevel(prev => prev === levelId ? null : levelId);
    setSelectedDuration(null);
    setRecommendations([]);
  };

  const handleDurationSelect = (durationId: string) => {
    setSelectedDuration(prev => prev === durationId ? null : durationId);
  };

  const handleReset = () => {
    setSelectedSkill(null);
    setSelectedLevel(null);
    setSelectedDuration(null);
    setSearchQuery('');
    setRecommendations([]);
    setError(null);
  };

  const handleGetRecommendations = async () => {
    if (!selectedSkill || !selectedLevel || !selectedDuration) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/recommend', {
        interests: selectedSkill,
        skillLevel: selectedLevel,
        duration: selectedDuration
      });
  
      // Ensure we always have an array, even if the response structure is unexpected
      let courses: Course[] = [];
      
      if (Array.isArray(response.data?.recommendations)) {
        courses = response.data.recommendations;
      } else if (Array.isArray(response.data)) {
        courses = response.data;
      } else if (response.data?.recommendations && typeof response.data.recommendations === 'object') {
        // Handle case where recommendations might be an object instead of array
        courses = Object.values(response.data.recommendations);
      }
  
      const processedCourses = courses.map((course: any) => ({
        ...course,
        course_skills: parseSkills(course.course_skills),
        course_rating: parseRating(course.course_rating)
      }));
  
      setRecommendations(processedCourses);
      
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch recommendations');
      setRecommendations([]); // Ensure empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const parseSkills = (skills: string[] | string | any): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
      try {
        // Handle JSON string
        if (skills.startsWith('[') || skills.startsWith('{')) {
          const parsed = JSON.parse(skills.replace(/'/g, '"'));
          return Array.isArray(parsed) ? parsed : [parsed];
        }
        // Handle comma-separated string
        return skills.split(',').map(s => s.trim());
      } catch {
        return [skills];
      }
    }
    return [];
  };

  const parseRating = (rating: any): number => {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseFloat(rating) || 0;
    return 0;
  };

  useEffect(() => {
    if (selectedSkill && selectedLevel && selectedDuration) {
      handleGetRecommendations();
    }
  }, [selectedSkill, selectedLevel, selectedDuration]);

  const getProgressWidth = () => {
    if (selectedSkill && selectedLevel && selectedDuration) return 'w-full';
    if (selectedSkill && selectedLevel) return 'w-2/3';
    if (selectedSkill) return 'w-1/3';
    return 'w-0';
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCourseSkills = (skills: string[] | string) => {
    const skillsArray = parseSkills(skills);
    if (!skillsArray.length) return null;
    
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {skillsArray.slice(0, 3).map((skill, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-full bg-purple-400/10 text-purple-400">
            {skill}
          </span>
        ))}
        {skillsArray.length > 3 && (
          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
            +{skillsArray.length - 3} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#2D1B69] text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          
        </h1>
        {(selectedSkill || selectedLevel || selectedDuration || searchQuery) && (
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-8 md:mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (web, security, AI, etc.)..."
            className="w-full px-12 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto mb-8 md:mb-12">
        <div className="flex justify-between text-xs md:text-sm mb-2">
          <span className={selectedSkill ? 'text-purple-400 font-medium' : 'text-white/60'}>1. Choose Skill</span>
          <span className={selectedLevel ? 'text-purple-400 font-medium' : 'text-white/60'}>2. Select Level</span>
          <span className={selectedDuration ? 'text-purple-400 font-medium' : 'text-white/60'}>3. Duration</span>
          <span className={selectedSkill && selectedLevel && selectedDuration ? 'text-purple-400 font-medium' : 'text-white/60'}>4. Results</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-purple-400 to-pink-400 ${getProgressWidth()}`}
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-6xl mx-auto mb-12 md:mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
          <span className="mr-2">✨</span>
          What do you want to learn?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillSelect(skill.id)}
              onMouseEnter={() => setShowTooltip(skill.id)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`relative p-4 md:p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 ${
                selectedSkill === skill.id 
                  ? `${skill.activeColor} ring-2 md:ring-4 ring-purple-400/50 shadow-lg` 
                  : 'bg-purple-700/80 hover:bg-purple-600'
              }`}
            >
              {skill.icon}
              <span className="mt-2 md:mt-3 text-sm font-medium">{skill.name}</span>
              {showTooltip === skill.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  {skill.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Levels Section */}
      {selectedSkill && (
        <div className="max-w-6xl mx-auto mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-xl md:text-2xl font-bold mb-6">What's your current skill level?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleLevelSelect(level.id)}
                className={`group p-5 md:p-6 rounded-xl text-center transition-all duration-300 ${
                  selectedLevel === level.id 
                    ? `bg-gradient-to-r ${level.color} shadow-lg scale-[1.02]` 
                    : 'bg-purple-700/80 hover:bg-purple-600'
                }`}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{level.name}</h3>
                <p className={`text-xs md:text-sm ${
                  selectedLevel === level.id ? 'text-white/90' : 'text-gray-300'
                }`}>
                  {level.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duration Section */}
      {selectedLevel && (
        <div className="max-w-6xl mx-auto mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            How much time can you commit?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {durations.map((duration) => (
              <button
                key={duration.id}
                onClick={() => handleDurationSelect(duration.id)}
                className={`p-5 md:p-6 rounded-xl text-center transition-all duration-300 ${
                  selectedDuration === duration.id 
                    ? 'bg-gradient-to-r from-violet-400 to-fuchsia-500 shadow-lg scale-[1.02]' 
                    : 'bg-purple-700/80 hover:bg-purple-600'
                }`}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{duration.name}</h3>
                <p className="text-xs md:text-sm text-gray-300">{duration.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Messages */}
      {isLoading && (
        <div className="max-w-6xl mx-auto text-center py-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10">
            <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
            <span>Finding the best courses for you...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-6xl mx-auto text-center py-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/20 text-red-300">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8 md:mt-16 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              Recommended Courses ({recommendations.length})
            </h2>
            {recommendations.length > 3 && (
              <button 
                onClick={handleReset}
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
              >
                <RefreshCcw className="w-4 h-4 mr-1" />
                Search Again
              </button>
            )}
          </div>
          
          <div className="grid gap-4 md:gap-6">
            {recommendations.map((course, index) => (
              <div
                key={`${course.course_title}-${index}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-purple-400 mb-1">
                      {course.course_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-gray-300 mb-2">
                      <span className="flex items-center">
                        <User className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {course.course_organization}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {course.course_time}
                      </span>
                      {course.course_certificate_type && (
                        <span className="flex items-center">
                          <Tag className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {course.course_certificate_type}
                        </span>
                      )}
                    </div>
                    
                    {course.course_summary && (
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                        {course.course_summary}
                      </p>
                    )}
                    
                    {renderCourseSkills(course.course_skills)}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {course.course_rating > 0 && (
                      <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                        <span className="ml-1 text-xs md:text-sm text-yellow-400">
                          {course.course_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                    
                    <a
                      href={course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs md:text-sm text-purple-400 hover:text-purple-300 transition mt-2"
                    >
                      View Course
                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                    </a>
                    
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-400/10 text-purple-400 capitalize">
                      {course.course_difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;