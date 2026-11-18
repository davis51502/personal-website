import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Work from './components/Work/Work';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import Race from './components/Race/Race';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';
import experience, { education, certifications } from './data/experience';
import { introLines, stats } from './data/home';
import { approach, caseStudies, sqlDemo, aiArticle } from './data/ai';

function MainContent() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer · Data & Automation';

  const skillGroups = [
    {
      label: 'Languages & tools',
      items: ['Python (Pandas, NumPy, scikit-learn, XGBoost)', 'SQL (PostgreSQL, MySQL)', 'JavaScript & React', 'AWS', 'Docker', 'Git', 'Excel', 'PowerPoint'],
    },
    {
      label: 'Markets & analysis',
      items: ['Predictive Modeling', 'Options Pricing (Black-Scholes)', 'Portfolio Backtesting', 'Financial Modeling', 'Statistical Analysis', 'Machine Learning', 'Risk Assessment'],
    },
  ];

  const location = useLocation();

  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'about';
    if (path.startsWith('/blog')) return 'blog';
    if (path === '/work') return 'work';
    if (path === '/race') return 'race';
    return 'about';
  };

  const activeSection = getActiveSection();

  // Start each page at the top instead of keeping the previous page's scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Header name={name} title={title} activeSection={activeSection} />
      
      <Routes>
        <Route path="/work" element={
          <main className="content-full">
            <Work projects={projects} approach={approach} caseStudies={caseStudies} sqlDemo={sqlDemo} article={aiArticle} />
          </main>
        } />

        {/* Old addresses from before Projects and AI were merged. */}
        <Route path="/projects" element={<Navigate to="/work" replace />} />
        <Route path="/ai" element={<Navigate to="/work" replace />} />

        <Route path="/race" element={
          <main className="content-full">
            <Race />
          </main>
        } />

        <Route path="/blog" element={
          <main className="content-full">
            <Blog />
          </main>
        } />

        {/* The hobbies page was removed; send old links home. */}
        <Route path="/hobbies" element={<Navigate to="/" replace />} />

        <Route path="/contact" element={
          <main className="content-full">
            <Contact email="daviswollesen@gmail.com" socials={socials} />
          </main>
        } />
        
        <Route path="/" element={
          <main className="content-full">
            <Home
              name={name}
              tagline={title}
              location="New York, NY"
              email="daviswollesen@gmail.com"
              socials={socials}
              photo="/IMG_0922.jpeg"
              introLines={introLines}
              stats={stats}
              featured={projects.slice(0, 3)}
              skillGroups={skillGroups}
              experience={experience}
              education={education}
              certifications={certifications}
            />
          </main>
        } />
      </Routes>
      
      <Footer socials={socials} email="daviswollesen@gmail.com" />
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
