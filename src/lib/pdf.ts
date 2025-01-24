import { PDFDocument } from 'pdf-lib'

export async function extractTextFromPDF(file: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(file)
  const pages = pdfDoc.getPages()
  let text = ''

  for (const page of pages) {
    const content = await page.getText()
    text += content + '\n'
  }

  return text
}

export async function parsePDFContent(text: string) {
  // Basic parsing logic - in a real app, this would be more sophisticated
  const sections = text.split('\n\n')
  
  return {
    personalInfo: {
      name: sections[0] || '',
      email: '',
      phone: '',
      linkedin: '',
      github: ''
    },
    education: [{
      institution: '',
      degree: '',
      dateRange: ''
    }],
    experience: [{
      position: '',
      company: '',
      dateRange: '',
      accomplishments: []
    }],
    projects: [{
      title: '',
      skills: '',
      dateRange: '',
      accomplishments: []
    }],
    additional: [{
      category: '',
      skills: ''
    }]
  }
}

