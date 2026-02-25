import type { CvInput } from '../../src/lib/zod-schemas/cv.js'

/** A complete, well-formed CV for testing (scores near 100). */
export function makeFullCv(): CvInput {
  return {
    templateId: 'jake',
    locale: 'en',
    header: {
      name: 'Jane Doe',
      location: 'San Francisco, CA',
      phone: '+1 555-123-4567',
      email: 'jane@example.com',
      linkedin: 'https://linkedin.com/in/janedoe',
      github: 'https://github.com/janedoe',
    },
    summary: {
      title: 'Professional Summary',
      text: 'Senior software engineer with 8 years of experience building scalable web applications. Proven track record of leading cross-functional teams and delivering products on time. Expertise in TypeScript, React, and cloud infrastructure.',
    },
    education: {
      title: 'Education',
      items: [
        {
          institution: 'Stanford University',
          degree: 'B.S. Computer Science',
          date: 'Sep 2012 - Jun 2016',
          location: 'Stanford, CA',
          highlights: ['GPA: 3.8/4.0', 'Dean\'s List all semesters'],
        },
      ],
    },
    experience: {
      title: 'Experience',
      items: [
        {
          company: 'TechCorp',
          role: 'Senior Software Engineer',
          date: 'Jan 2020 - Present',
          location: 'San Francisco, CA',
          highlights: [
            'Architected a microservices platform serving 10M+ daily users, reducing latency by 40%',
            'Led a team of 6 engineers to deliver a $2M revenue-generating feature in 3 months',
            'Implemented CI/CD pipeline that reduced deployment time from 2 hours to 15 minutes',
            'Mentored 4 junior developers, with 2 promoted to mid-level within 1 year',
          ],
        },
        {
          company: 'StartupInc',
          role: 'Software Engineer',
          date: 'Jul 2016 - Dec 2019',
          location: 'Palo Alto, CA',
          highlights: [
            'Developed a real-time analytics dashboard processing 500K events per second',
            'Reduced infrastructure costs by 35% through optimization of cloud resources',
            'Built an automated testing framework that increased code coverage from 40% to 90%',
          ],
        },
      ],
    },
    projects: {
      title: 'Projects',
      items: [
        {
          name: 'OpenSource CLI Tool',
          tech: 'TypeScript, Node.js',
          date: '2021',
          highlights: [
            'Created a developer productivity tool with 2K+ GitHub stars',
            'Implemented plugin system used by 50+ community contributors',
          ],
        },
      ],
    },
    skills: {
      title: 'Skills',
      categories: [
        { name: 'Languages', values: 'TypeScript, JavaScript, Python, Go, SQL' },
        { name: 'Frameworks', values: 'React, Next.js, Node.js, Express, FastAPI' },
        { name: 'Cloud & DevOps', values: 'AWS, Docker, Kubernetes, Terraform, CI/CD' },
      ],
    },
    languages: {
      title: 'Languages',
      items: [
        { name: 'English', level: 'Native' },
        { name: 'Spanish', level: 'Professional' },
      ],
    },
  }
}

/** A completely empty CV for testing (scores 0). */
export function makeEmptyCv(): CvInput {
  return {
    templateId: 'jake',
    locale: 'en',
    header: {
      name: '',
      location: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
    },
    summary: { title: '', text: '' },
    education: { title: '', items: [] },
    experience: { title: '', items: [] },
    projects: { title: '', items: [] },
    skills: { title: '', categories: [] },
    languages: { title: '', items: [] },
  }
}
