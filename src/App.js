import React from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';

function MainContent() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer/Investment Analyst';
  
  const bio = "I'm a Computer Science major specializing in applying technical expertise to financial markets and investment strategies. With a strong foundation in software development and data analysis, I'm passionate about building data-driven solutions that uncover investment insights and optimize portfolio performance. My goal is to bridge the gap between cutting-edge technology and quantitative finance.";
  
  const skillGroups = [
    {
      label: 'Languages & tools',
      items: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL & PostgreSQL', 'Pandas & NumPy', 'Git & Docker', 'API Integration'],
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
    if (path === '/contact') return 'contact';
    return 'about';
  };

  const handleNavigate = (id) => {
    navigate(`/${id === 'about' ? '' : id}`);
  };

  const activeSection = getActiveSection();

  return (
    <div className="App">
      <Header name={name} title={title} activeSection={activeSection} onNavigate={handleNavigate} />
      
      <Routes>
        <Route path="/projects" element={
          <main className="content-full">
            <Projects projects={projects} />
          </main>
        } />

        <Route path="/blog" element={
          <main className="content-full">
            <Blog />
          </main>
        } />

        <Route path="/contact" element={
          <main className="content-full">
            <Contact email="daviswollesen@gmail.com" />
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
