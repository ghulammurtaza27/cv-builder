interface TemplateSelectorProps {
  applyTemplate: (template: { id: string; name: string; preview: string }) => void
}

export function TemplateSelector({ applyTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      id: 'minimal',
      name: 'Minimal',
      preview: '/templates/minimal.png',
    },
    {
      id: 'professional',
      name: 'Professional',
      preview: '/templates/professional.png',
    },
    {
      id: 'modern',
      name: 'Modern',
      preview: '/templates/modern.png',
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {templates.map(template => (
        <button
          key={template.id}
          className="p-4 border rounded-lg hover:border-primary"
          onClick={() => applyTemplate(template)}
        >
          <img src={template.preview} alt={template.name} />
          <p>{template.name}</p>
        </button>
      ))}
    </div>
  )
} 