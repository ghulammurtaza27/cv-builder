# CV Builder Application

A modern CV/Resume builder application built with Next.js that allows users to create, edit, and export professional CVs in PDF format.

## Features

- 📝 Interactive CV editing
- 🎨 Modern, clean interface
- 📱 Responsive design
- 📄 PDF export functionality
- 💾 Real-time preview
- 🎯 Easy-to-use form interface
- 🤖 AI-powered CV enhancement

## AI-Powered CV Enhancement

The application includes an AI assistant to help improve your CV content:

- **Experience Enhancement**: Transform basic job descriptions into powerful achievement statements
- **Skills Optimization**: Get suggestions for relevant skills based on your role and industry
- **Language Refinement**: Improve the language and tone of your CV entries
- **Action Verbs**: Get suggestions for strong action verbs to start your bullet points
- **Achievements Quantification**: Get help adding metrics and numbers to your achievements

Example:
```
Original: "Managed a team and improved sales"
AI Enhanced: "Led a 12-person sales team, driving a 45% increase in quarterly revenue through strategic client relationship management"
```

To use the AI feature:
1. Enter your basic experience or skill information
2. Click the "Enhance with AI" button
3. Choose from suggested improvements or request new variations

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [@react-pdf/renderer](https://react-pdf.org/) - PDF generation

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone [your-repo-url]
cd cv-builder
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development Notes

- This project uses `npm` as the package manager
- Legacy peer dependencies are enabled (`npm config set legacy-peer-deps true`)
- Node.js version 16.x or higher is recommended

## Deployment

The application is configured for deployment on [Vercel](https://vercel.com). To deploy your own instance:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
