import React from 'react';
import Projects from '../Projects/Projects';
import AI from '../AI/AI';

// Projects and the AI write-up used to be separate pages; they read better as one.
export default function Work({ projects, approach, caseStudies, sqlDemo, article }) {
  return (
    <>
      <Projects projects={projects} />
      <AI approach={approach} caseStudies={caseStudies} sqlDemo={sqlDemo} article={article} />
    </>
  );
}
