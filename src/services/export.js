const PDFDocument = require('pdfkit');
const docx = require('docx');
const { Document, Paragraph, TextRun, TableCell, Table, TableRow, HeadingLevel } = docx;

class ExportService {
  // PDF export with different styles
  async generatePDF(resume, style = 'professional') {
    const doc = new PDFDocument();
    
    switch(style) {
      case 'modern':
        return this.generateModernPDF(doc, resume);
      case 'creative':
        return this.generateCreativePDF(doc, resume);
      case 'minimal':
        return this.generateMinimalPDF(doc, resume);
      case 'professional':
      default:
        return this.generateProfessionalPDF(doc, resume);
    }
  }

  // Word document export
  async generateDOCX(resume, style = 'professional') {
    switch(style) {
      case 'modern':
        return this.generateModernDOCX(resume);
      case 'creative':
        return this.generateCreativeDOCX(resume);
      case 'minimal':
        return this.generateMinimalDOCX(resume);
      case 'professional':
      default:
        return this.generateProfessionalDOCX(resume);
    }
  }

  // Professional style PDF
  async generateProfessionalPDF(doc, resume) {
    // Header with contact info
    doc.fontSize(24).text(`${resume.firstName} ${resume.lastName}`, { align: 'center' });
    doc.fontSize(12).text(resume.email, { align: 'center' });
    
    // Summary
    doc.moveDown();
    doc.fontSize(16).text('Professional Summary');
    doc.fontSize(12).text(resume.sections.summary);

    // Experience
    doc.moveDown();
    doc.fontSize(16).text('Experience');
    resume.sections.experience.forEach(exp => {
      doc.fontSize(14).text(exp.title);
      doc.fontSize(12).text(`${exp.company} | ${exp.startDate} - ${exp.endDate}`);
      exp.highlights.forEach(highlight => {
        doc.fontSize(12).text(`• ${highlight}`);
      });
      doc.moveDown();
    });

    // Skills
    doc.moveDown();
    doc.fontSize(16).text('Skills');
    resume.sections.skills.forEach(skillCategory => {
      doc.fontSize(14).text(skillCategory.category);
      doc.fontSize(12).text(skillCategory.items.join(', '));
      doc.moveDown();
    });

    return doc;
  }

  // Modern style DOCX
  async generateModernDOCX(resume) {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `${resume.firstName} ${resume.lastName}`,
            heading: HeadingLevel.TITLE,
            alignment: docx.AlignmentType.CENTER
          }),
          new Paragraph({
            text: resume.email,
            alignment: docx.AlignmentType.CENTER
          }),
          new Paragraph({
            text: 'Professional Summary',
            heading: HeadingLevel.HEADING_1
          }),
          new Paragraph({
            text: resume.sections.summary
          })
        ]
      }]
    });

    // Add experience section
    const experienceSection = [
      new Paragraph({
        text: 'Experience',
        heading: HeadingLevel.HEADING_1
      })
    ];

    resume.sections.experience.forEach(exp => {
      experienceSection.push(
        new Paragraph({
          text: exp.title,
          heading: HeadingLevel.HEADING_2
        }),
        new Paragraph({
          text: `${exp.company} | ${exp.startDate} - ${exp.endDate}`
        })
      );

      exp.highlights.forEach(highlight => {
        experienceSection.push(
          new Paragraph({
            text: `• ${highlight}`
          })
        );
      });
    });

    doc.addSection({
      children: experienceSection
    });

    return doc;
  }

  // Generate plain text version
  generatePlainText(resume) {
    let text = `${resume.firstName} ${resume.lastName}\n`;
    text += `${resume.email}\n\n`;
    
    text += 'PROFESSIONAL SUMMARY\n';
    text += '===================\n';
    text += `${resume.sections.summary}\n\n`;
    
    text += 'EXPERIENCE\n';
    text += '==========\n';
    resume.sections.experience.forEach(exp => {
      text += `${exp.title}\n`;
      text += `${exp.company} | ${exp.startDate} - ${exp.endDate}\n`;
      exp.highlights.forEach(highlight => {
        text += `• ${highlight}\n`;
      });
      text += '\n';
    });
    
    return text;
  }

  // Generate ATS-optimized version
  generateATSVersion(resume) {
    // Simple format with clear sections and keywords
    let text = `${resume.firstName} ${resume.lastName}\n`;
    text += `${resume.email}\n\n`;
    
    // Add target job title for ATS
    text += `Target Position: ${resume.targetJobTitle}\n\n`;
    
    // Summary with keywords
    text += 'Professional Summary\n';
    text += `${resume.sections.summary}\n\n`;
    
    // Skills section with all keywords
    text += 'Core Skills\n';
    resume.sections.skills.forEach(skillCategory => {
      text += `${skillCategory.category}: ${skillCategory.items.join(', ')}\n`;
    });
    text += '\n';
    
    // Experience with measurable results
    text += 'Professional Experience\n';
    resume.sections.experience.forEach(exp => {
      text += `${exp.title} - ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.endDate}\n`;
      exp.highlights.forEach(highlight => {
        text += `• ${highlight}\n`;
      });
      text += '\n';
    });
    
    return text;
  }
}

module.exports = new ExportService();
