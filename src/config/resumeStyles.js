// Additional resume styles
const RESUME_STYLES = {
  // Executive style for senior positions
  executive: {
    fonts: {
      title: { size: 28, font: 'Times-Roman' },
      heading: { size: 16, font: 'Helvetica-Bold' },
      body: { size: 11, font: 'Times-Roman' }
    },
    colors: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#95A5A6'
    },
    spacing: {
      lineHeight: 1.5,
      sectionGap: 20,
      paragraphGap: 10
    }
  },

  // Technical style for IT/Engineering
  technical: {
    fonts: {
      title: { size: 24, font: 'Courier-Bold' },
      heading: { size: 14, font: 'Courier-Bold' },
      body: { size: 11, font: 'Courier' }
    },
    colors: {
      primary: '#2980B9',
      secondary: '#3498DB',
      accent: '#BDC3C7'
    },
    spacing: {
      lineHeight: 1.3,
      sectionGap: 15,
      paragraphGap: 8
    }
  },

  // Academic style for education/research
  academic: {
    fonts: {
      title: { size: 26, font: 'Helvetica-Bold' },
      heading: { size: 14, font: 'Helvetica-Bold' },
      body: { size: 11, font: 'Helvetica' }
    },
    colors: {
      primary: '#8E44AD',
      secondary: '#9B59B6',
      accent: '#D5D8DC'
    },
    spacing: {
      lineHeight: 1.4,
      sectionGap: 25,
      paragraphGap: 12
    }
  },

  // Federal style for government positions
  federal: {
    fonts: {
      title: { size: 24, font: 'Times-Bold' },
      heading: { size: 14, font: 'Times-Bold' },
      body: { size: 12, font: 'Times-Roman' }
    },
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666'
    },
    spacing: {
      lineHeight: 1.15,
      sectionGap: 12,
      paragraphGap: 6
    }
  }
};

// Additional export formats
const EXPORT_FORMATS = {
  // LinkedIn format
  linkedin: (resume) => {
    return {
      profile: {
        firstName: resume.firstName,
        lastName: resume.lastName,
        headline: resume.sections.summary.split('.')[0],
        summary: resume.sections.summary,
        industry: resume.targetIndustry
      },
      experience: resume.sections.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        description: exp.highlights.join('\\n')
      })),
      skills: resume.sections.skills.reduce((acc, skill) => 
        [...acc, ...skill.items], []),
      education: resume.sections.education.map(edu => ({
        school: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        graduationYear: edu.graduationYear
      }))
    };
  },

  // Indeed format
  indeed: (resume) => {
    return {
      contact_info: {
        name: `${resume.firstName} ${resume.lastName}`,
        email: resume.email,
        phone: resume.phone,
        location: resume.location
      },
      work_experience: resume.sections.experience.map(exp => ({
        job_title: exp.title,
        company: exp.company,
        start_date: exp.startDate,
        end_date: exp.endDate,
        job_description: exp.highlights.join('\\n')
      })),
      education: resume.sections.education,
      skills: resume.sections.skills,
      additional_info: resume.sections.certifications
    };
  },

  // JSON-LD format (for structured data)
  jsonld: (resume) => {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": `${resume.firstName} ${resume.lastName}`,
      "jobTitle": resume.targetJobTitle,
      "description": resume.sections.summary,
      "worksFor": resume.sections.experience.map(exp => ({
        "@type": "Organization",
        "name": exp.company,
        "member": {
          "@type": "OrganizationRole",
          "roleName": exp.title,
          "startDate": exp.startDate,
          "endDate": exp.endDate
        }
      })),
      "hasSkill": resume.sections.skills.reduce((acc, skill) => 
        [...acc, ...skill.items], []),
      "alumniOf": resume.sections.education.map(edu => ({
        "@type": "CollegeOrUniversity",
        "name": edu.institution,
        "degree": edu.degree
      }))
    };
  },

  // LaTeX format
  latex: (resume) => {
    return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\begin{document}

\\centerline{\\huge ${resume.firstName} ${resume.lastName}}
\\vspace{0.5em}
\\centerline{${resume.email} | ${resume.phone}}

\\section*{Professional Summary}
${resume.sections.summary}

\\section*{Experience}
${resume.sections.experience.map(exp => `
\\subsection*{${exp.title} at ${exp.company}}
\\textit{${exp.startDate} - ${exp.endDate}}
${exp.highlights.map(h => `\\item ${h}`).join('\\n')}
`).join('\\n')}

\\section*{Skills}
${resume.sections.skills.map(skill => `
\\subsection*{${skill.category}}
${skill.items.join(', ')}
`).join('\\n')}

\\section*{Education}
${resume.sections.education.map(edu => `
\\subsection*{${edu.institution}}
${edu.degree} in ${edu.fieldOfStudy}, ${edu.graduationYear}
`).join('\\n')}

\\end{document}`
  }
};

module.exports = {
  RESUME_STYLES,
  EXPORT_FORMATS
};
