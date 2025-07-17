import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Download, Edit3, Save, FileText, FileMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface EditableCVProps {
  initialResume: string;
  userData: any;
}

interface ParsedResume {
  name: string;
  title: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    duration: string;
  }>;
  skills: string[];
}

export const EditableCV = ({ initialResume, userData }: EditableCVProps) => {
  const { toast } = useToast();
  const cvRef = useRef<HTMLDivElement>(null);
  
  // Parse the initial resume text into structured data
  const parseResume = (resumeText: string): ParsedResume => {
    // Basic parsing logic - this could be enhanced with more sophisticated parsing
    const lines = resumeText.split('\n').filter(line => line.trim());
    
    const parsed: ParsedResume = {
      name: lines[0] || userData.name || 'Your Name',
      title: userData.targetRole || 'Professional Title',
      contact: {
        phone: '',
        email: '',
        linkedin: '',
        location: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: userData.keySkills || []
    };

    let currentSection = '';
    let currentExp: any = {};
    let currentEdu: any = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('summary') || lowerLine.includes('profile')) {
        currentSection = 'summary';
      } else if (lowerLine.includes('experience') || lowerLine.includes('work')) {
        currentSection = 'experience';
      } else if (lowerLine.includes('education')) {
        currentSection = 'education';
      } else if (lowerLine.includes('skills')) {
        currentSection = 'skills';
      } else if (line.includes('@')) {
        parsed.contact.email = line;
      } else if (line.includes('linkedin')) {
        parsed.contact.linkedin = line;
      } else if (currentSection === 'summary' && line.length > 20) {
        parsed.summary += line + ' ';
      }
    }
    
    // Default values if parsing doesn't find content
    if (!parsed.summary) {
      parsed.summary = resumeText.substring(0, 300) + '...';
    }
    
    if (parsed.experience.length === 0) {
      parsed.experience = [{
        title: userData.targetRole || 'Position Title',
        company: 'Company Name',
        duration: '2022 - Present',
        description: 'Key achievements and responsibilities...'
      }];
    }
    
    if (parsed.education.length === 0) {
      parsed.education = [{
        degree: 'Degree',
        institution: 'Institution',
        duration: '2020 - 2024'
      }];
    }
    
    return parsed;
  };

  const [resumeData, setResumeData] = useState<ParsedResume>(parseResume(initialResume));
  const [isEditing, setIsEditing] = useState(false);

  const updateField = (section: string, index: number | null, field: string, value: string) => {
    setResumeData(prev => {
      const updated = { ...prev };
      if (section === 'contact') {
        updated.contact = { ...updated.contact, [field]: value };
      } else if (section === 'experience' && index !== null) {
        updated.experience = [...updated.experience];
        updated.experience[index] = { ...updated.experience[index], [field]: value };
      } else if (section === 'education' && index !== null) {
        updated.education = [...updated.education];
        updated.education[index] = { ...updated.education[index], [field]: value };
      } else {
        (updated as any)[field] = value;
      }
      return updated;
    });
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: 'New Position',
        company: 'Company Name',
        duration: '2024 - Present',
        description: 'Describe your achievements...'
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const generateDocx = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with name and title
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.name,
                  bold: true,
                  size: 32,
                  color: "2563eb"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.title,
                  size: 24,
                  color: "64748b"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // Contact Information
            new Paragraph({
              children: [
                new TextRun({
                  text: `${resumeData.contact.email} | ${resumeData.contact.phone} | ${resumeData.contact.linkedin} | ${resumeData.contact.location}`,
                  size: 20
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Summary Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROFESSIONAL SUMMARY",
                  bold: true,
                  size: 24,
                  color: "1f2937"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.summary,
                  size: 20
                })
              ],
              spacing: { after: 400 }
            }),

            // Experience Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "EXPERIENCE",
                  bold: true,
                  size: 24,
                  color: "1f2937"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            
            ...resumeData.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.title,
                    bold: true,
                    size: 22
                  }),
                  new TextRun({
                    text: ` | ${exp.company}`,
                    size: 22,
                    color: "64748b"
                  }),
                  new TextRun({
                    text: ` | ${exp.duration}`,
                    size: 20,
                    color: "94a3b8"
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.description,
                    size: 20
                  })
                ],
                spacing: { after: 300 }
              })
            ]),

            // Education Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "EDUCATION",
                  bold: true,
                  size: 24,
                  color: "1f2937"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            
            ...resumeData.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 22
                  }),
                  new TextRun({
                    text: ` | ${edu.institution}`,
                    size: 22,
                    color: "64748b"
                  }),
                  new TextRun({
                    text: ` | ${edu.duration}`,
                    size: 20,
                    color: "94a3b8"
                  })
                ],
                spacing: { before: 200, after: 300 }
              })
            ]),

            // Skills Section
            new Paragraph({
              children: [
                new TextRun({
                  text: "SKILLS",
                  bold: true,
                  size: 24,
                  color: "1f2937"
                })
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.skills.join(' • '),
                  size: 20
                })
              ],
              spacing: { after: 200 }
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resumeData.name.replace(/\s+/g, '_')}_Resume.docx`);
      
      toast({
        title: "DOCX Downloaded",
        description: "Your resume has been downloaded as a Word document.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate DOCX file.",
        variant: "destructive",
      });
    }
  };

  const generatePDF = async () => {
    try {
      if (!cvRef.current) return;
      
      const canvas = await html2canvas(cvRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded as a PDF document.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to generate PDF file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Save Changes' : 'Edit Resume'}
        </Button>
        <Button
          onClick={generateDocx}
          className="flex items-center gap-2 bg-gradient-primary"
        >
          <FileText className="w-4 h-4" />
          Download DOCX
        </Button>
        <Button
          onClick={generatePDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* CV Preview/Edit */}
      <Card className="p-8 bg-background shadow-medium border-0 max-w-4xl mx-auto">
        <div ref={cvRef} className="min-h-[600px] space-y-6">
          {/* Header Section */}
          <div className="text-center border-b pb-6">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={resumeData.name}
                  onChange={(e) => updateField('basic', null, 'name', e.target.value)}
                  className="text-4xl font-bold text-center"
                  placeholder="Your Name"
                />
                <Input
                  value={resumeData.title}
                  onChange={(e) => updateField('basic', null, 'title', e.target.value)}
                  className="text-xl text-center"
                  placeholder="Professional Title"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    value={resumeData.contact.email}
                    onChange={(e) => updateField('contact', null, 'email', e.target.value)}
                    placeholder="Email"
                  />
                  <Input
                    value={resumeData.contact.phone}
                    onChange={(e) => updateField('contact', null, 'phone', e.target.value)}
                    placeholder="Phone"
                  />
                  <Input
                    value={resumeData.contact.linkedin}
                    onChange={(e) => updateField('contact', null, 'linkedin', e.target.value)}
                    placeholder="LinkedIn"
                  />
                  <Input
                    value={resumeData.contact.location}
                    onChange={(e) => updateField('contact', null, 'location', e.target.value)}
                    placeholder="Location"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">{resumeData.name}</h1>
                <h2 className="text-xl text-primary mb-4">{resumeData.title}</h2>
                <div className="text-muted-foreground">
                  {[resumeData.contact.email, resumeData.contact.phone, resumeData.contact.linkedin, resumeData.contact.location]
                    .filter(Boolean)
                    .join(' | ')}
                </div>
              </div>
            )}
          </div>

          {/* Summary Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-1">
              PROFESSIONAL SUMMARY
            </h3>
            {isEditing ? (
              <Textarea
                value={resumeData.summary}
                onChange={(e) => updateField('basic', null, 'summary', e.target.value)}
                className="min-h-[100px]"
                placeholder="Professional summary..."
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{resumeData.summary}</p>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-foreground border-b border-border pb-1">
                EXPERIENCE
              </h3>
              {isEditing && (
                <Button onClick={addExperience} size="sm" variant="outline">
                  Add Experience
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <Input
                            value={exp.title}
                            onChange={(e) => updateField('experience', index, 'title', e.target.value)}
                            placeholder="Job Title"
                          />
                          <Input
                            value={exp.company}
                            onChange={(e) => updateField('experience', index, 'company', e.target.value)}
                            placeholder="Company"
                          />
                        </div>
                        <Button
                          onClick={() => removeExperience(index)}
                          size="sm"
                          variant="ghost"
                          className="ml-2"
                        >
                          <FileMinus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateField('experience', index, 'duration', e.target.value)}
                        placeholder="Duration"
                      />
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateField('experience', index, 'description', e.target.value)}
                        placeholder="Job description and achievements..."
                        className="min-h-[80px]"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{exp.title}</h4>
                        <span className="text-primary">|</span>
                        <span className="text-primary">{exp.company}</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="text-muted-foreground text-sm">{exp.duration}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-1">
              EDUCATION
            </h3>
            <div className="space-y-2">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateField('education', index, 'degree', e.target.value)}
                        placeholder="Degree"
                      />
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateField('education', index, 'institution', e.target.value)}
                        placeholder="Institution"
                      />
                      <Input
                        value={edu.duration}
                        onChange={(e) => updateField('education', index, 'duration', e.target.value)}
                        placeholder="Duration"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{edu.degree}</span>
                      <span className="text-primary">|</span>
                      <span className="text-primary">{edu.institution}</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-muted-foreground text-sm">{edu.duration}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 border-b border-border pb-1">
              SKILLS
            </h3>
            {isEditing ? (
              <Textarea
                value={resumeData.skills.join(', ')}
                onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value.split(', ').filter(s => s.trim()) }))}
                placeholder="Skill 1, Skill 2, Skill 3..."
                className="min-h-[60px]"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};