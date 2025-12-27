import {
  BrainCircuit,
  DatabaseZap,
  LayoutGrid,
  Lightbulb,
  LucideIcon,
  ShieldCheck,
  FileCode,
  Banknote,
  BrainCog,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: DatabaseZap,
    title: 'Data Warehousing',
    description:
      'Architecting robust, scalable data warehouses that serve as the single source of truth for your business intelligence and analytics.',
  },
  {
    icon: BrainCircuit,
    title: 'GenAI Applications',
    description:
      'Developing bespoke Generative AI applications that automate processes, enhance creativity, and create new value streams.',
  },
  {
    icon: LayoutGrid,
    title: 'Data Engineering',
    description:
      'Building and managing resilient data pipelines that ensure timely, accurate, and accessible data across your organization.',
  },
  {
    icon: Lightbulb,
    title: 'AI Insights',
    description:
      'Leveraging advanced AI and machine learning models to uncover actionable insights and drive strategic decision-making.',
  },
];

export interface Solution {
  icon: LucideIcon;
  title: string;
  problem: string;
  description: string;
  href: string;
}

export const solutions: Solution[] = [
  {
    icon: FileCode,
    title: 'Data-Flow Delta',
    problem: 'Manual & Error-Prone Scripting',
    description:
      'Automates data flow processes by generating Python scripts from natural language requirements, reducing development time and errors.',
    href: '/solutions#data-flow-delta',
  },
  {
    icon: ShieldCheck,
    title: 'Regu-Assist',
    problem: 'Navigating Complex Regulations',
    description:
      'Analyzes regulatory documents to ensure your operations are compliant with the latest industry standards, mitigating risk.',
    href: '/solutions#regu-assist',
  },
  {
    icon: Banknote,
    title: 'Credit-Wise',
    problem: 'Uncertain Credit Risk',
    description:
      'Assesses credit risk with high accuracy by analyzing financial data, enabling smarter lending and investment decisions.',
    href: '/solutions#credit-wise',
  },
  {
    icon: BrainCog,
    title: 'Intel Advisor',
    problem: 'Suboptimal Business Strategy',
    description:
      'Provides AI-driven strategic recommendations from operational data to optimize efficiency and accelerate growth.',
    href: '/solutions#intel-advisor',
  },
];

export interface TeamMember {
  image: string;
  name: string;
  title: string;
  niche: string;
  bio: string;
}

export const team: TeamMember[] = [
  {
    image: PlaceHolderImages.find(p => p.id === 'tajudeen-abdulazeez')?.imageUrl || '',
    name: 'Tajudeen Abdulazeez',
    title: 'Data Engineering Lead',
    niche: 'Data Engineering & Transformation',
    bio: 'With over a decade of experience, Tajudeen delivers transformative data solutions.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'ismail-akinwale')?.imageUrl || '',
    name: 'Dr. Ismail Akinwale',
    title: 'Linux system Administrator',
    niche: 'Linux Systems & Infrastructure',
    bio: 'Ismail applies deep Linux expertise to optimize systems, ensure security, and deliver reliable, scalable infrastructure solutions.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'shereef-bankole')?.imageUrl || '',
    name: 'Dr. Shereef Bankole',
    title: 'Generative AI Specialist',
    niche: 'Generative AI & Strategy',
    bio: 'Shereef thrives on crafting creative AI strategies that solve complex challenges.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'dayo-adebayo')?.imageUrl || '',
    name: 'Dayo Adebayo',
    title: 'Strategy Consultant',
    niche: 'Leadership & Strategy',
    bio: 'Dayo excels at fostering leadership and designing impactful strategies.',
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'dotun-oladele')?.imageUrl || '',
    name: 'Dotun Oladele, PMP',
    title: 'Project Management Specialist',
    niche: 'Strategic Project Management',
    bio: 'Dotun excels at designing strategic project management solutions that drive clarity, efficiency, and successful outcomes in complex environments.',
  },
];

export interface Resource {
  title: string;
  summary: string;
  href: string;
}

export const resources: Resource[] = [
  {
    title: 'Measuring Massive Multitask Language Understanding (MMLU)',
    summary: 'This paper establishes a crucial benchmark for evaluating how well AI can handle diverse, human-level tasks, guiding clients towards robust, general-purpose models.',
    href: 'https://arxiv.org/pdf/2009.03300',
  },
  {
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    summary: 'LoRA provides a method for efficiently adapting large models, offering clients a faster, more affordable path to customized AI solutions without costly full retraining.',
    href: 'https://arxiv.org/pdf/2106.09685',
  },
  {
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    summary: 'By enabling models to "think step-by-step," this technique unlocks complex reasoning capabilities, which is vital for clients tackling multi-stage analytical problems.',
    href: 'https://arxiv.org/pdf/2210.11416',
  },
   {
    title: 'Sparks of Artificial General Intelligence: Early experiments with GPT-4',
    summary: 'This work explores the surprisingly versatile and human-like capabilities of GPT-4, demonstrating its potential to solve novel and difficult tasks for our clients.',
    href: 'https://arxiv.org/pdf/2303.17564',
  },
  {
    title: 'The Data Warehouse Toolkit by Ralph Kimball',
    summary: 'A foundational guide to dimensional modeling, this book provides the essential patterns for designing data warehouses that deliver long-term business value for our clients.',
    href: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/data-warehouse-dw-toolkit/',
  },
  {
    title: 'Generative AI on AWS',
    summary: 'This practical guide showcases how to build and deploy multimodal generative AI applications on AWS, empowering clients to leverage cutting-edge AI within a secure, scalable cloud ecosystem.',
    href: 'https://www.amazon.com/Generative-AI-AWS-Multimodal-Applications/dp/1098159225/',
  },
];
