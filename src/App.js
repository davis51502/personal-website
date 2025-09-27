import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import projects, { socials } from './data/projects';

function App() {
  const name = 'Davis Wollesen';
  const title = 'Software Engineer/Investment Analyst';
  
  // Enhanced bio for investment analytics focus
  const bio = "I'm a Computer Science major specializing in applying technical expertise to financial markets and investment strategies. With a strong foundation in software development and data analysis, I'm passionate about building data-driven solutions that uncover investment insights and optimize portfolio performance. My goal is to bridge the gap between cutting-edge technology and quantitative finance.";
  
  // Expanded skills list tailored for investment analytics
  const skills = [
    'Python',
    'JavaScript', 
    'React',
    'Node.js',
    'SQL & PostgreSQL',
    'Data Analysis & Visualization',
    'Financial Modeling',
    'Statistical Analysis',
    'Machine Learning',
    'Pandas & NumPy',
    'API Integration',
    'Git & Docker',
    'Quantitative Research',
    'Portfolio Optimization',
    'Risk Assessment'
  ];

  const [activeSection, setActiveSection] = React.useState('about');

  const handleNavigate = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="App">
      <Header name={name} title={title} socials={socials} activeSection={activeSection} onNavigate={handleNavigate} />
      <div className="layout container">
        <Sidebar
          name={name}
          location="Danville, CA"
          email="daviswollesen@gmail.com"
          socials={socials}
          photo="/IMG_0922.jpeg"
        />
        <main className="content">
          {activeSection === 'about' && <About bio={bio} skills={skills} />}
          {activeSection === 'projects' && <Projects projects={projects} />}
          {activeSection === 'contact' && <Contact email="daviswollesen@gmail.com" />}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;