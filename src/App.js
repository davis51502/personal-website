import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import Hobbies from './components/Hobbies/Hobbies';
import AI from './components/AI/AI';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';
import experience, { education, certifications } from './data/experience';
import hobbies from './data/hobbies';
import { approach, caseStudies, sqlDemo, aiArticle } from './data/ai';

function MainContent() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer · Investment Analyst';
  
  const bio = "I'm a software engineer with a B.S. in Computer Science from BYU, focused on applying technical skills to financial markets and investment strategy. I've built AWS data pipelines over terabytes of healthcare data, shipped production websites, and built my own investment research tools. I'm most interested in data-driven work that bridges engineering and quantitative finance.";
  
  const skillGroups = [
    {
      label: 'Languages & tools',
      items: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL (PostgreSQL, MySQL)', 'Pandas, NumPy & scikit-learn', 'AWS', 'Git & Docker', 'API Integration'],
    },
    {
      label: 'Markets & analysis',
      items: ['Data Analysis & Visualization', 'Financial Modeling', 'Statistical Analysis', 'Machine Learning', 'Quantitative Research', 'Portfolio Optimization', 'Risk Assessment'],
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'about';
    if (path.startsWith('/blog')) return 'blog';
    if (path === '/projects') return 'projects';
    if (path === '/ai') return 'ai';
    if (path === '/hobbies') return 'hobbies';
    if (path === '/contact') return 'contact';
    return 'about';
  };

  const handleNavigate = (id) => {
    navigate(`/${id === 'about' ? '' : id}`);
  };

  const activeSection = getActiveSection();

  // Start each page at the top instead of keeping the previous page's scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header name={name} title={title} activeSection={activeSection} onNavigate={handleNavigate} />
      
      <Routes>
        <Route path="/projects" element={
          <main className="content-full">
            <Projects projects={projects} />
          </main>
        } />

        <Route path="/ai" element={
          <main className="content-full">
            <AI approach={approach} caseStudies={caseStudies} sqlDemo={sqlDemo} article={aiArticle} />
          </main>
        } />

        <Route path="/blog" element={
          <main className="content-full">
            <Blog />
          </main>
        } />

        <Route path="/hobbies" element={
          <main className="content-full">
            <Hobbies hobbies={hobbies} />
          </main>
        } />

        <Route path="/contact" element={
          <main className="content-full">
            <Contact email="daviswollesen@gmail.com" socials={socials} />
          </main>
        } />
        
        <Route path="/" element={
          <main className="content-full">
            <About
              name={name}
              location="Danville, CA"
              email="daviswollesen@gmail.com"
              socials={socials}
              photo="/IMG_0922.jpeg"
              bio={bio}
              skillGroups={skillGroups}
              experience={experience}
              education={education}
              certifications={certifications}
            />
          </main>
        } />
      </Routes>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
