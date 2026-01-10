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
  MessageCircleQuestion,
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
    icon: MessageCircleQuestion,
    title: 'Data & Warehouse Q&A',
    problem: 'Getting Quick, Expert Answers',
    description: 'Ask any question about data engineering or data warehousing and get an instant, expert response from our AI specialist to demonstrate our expertise.',
    href: '/solutions#data-warehouse-qa',
  },
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
    image: '/teejay.PNG',
    name: 'Tajudeen Abdulazeez',
    title: 'Data Engineering Lead',
    niche: 'Data Engineering & Transformation',
    bio: 'With over a decade of experience, Tajudeen delivers transformative data solutions.',
  },
  {
    image: '/ismail.jpeg',
    name: 'Dr. Ismail Akinwale',
    title: 'Linux system Administrator',
    niche: 'Linux Systems & Infrastructure',
    bio: 'Ismail applies deep Linux expertise to optimize systems, ensure security, and deliver reliable, scalable infrastructure solutions.',
  },
  {
    image: '/shereef.jpeg',
    name: 'Dr. Shereef Bankole',
    title: 'Generative AI Specialist',
    niche: 'Generative AI & Strategy',
    bio: 'Shereef thrives on crafting creative AI strategies that solve complex challenges.',
  },
  {
    image: '/dayo.jpeg',
    name: 'Dayo Adebayo',
    title: 'Strategy Consultant',
    niche: 'Leadership & Strategy',
    bio: 'Dayo excels at fostering leadership and designing impactful strategies.',
  },
  {
    image: '/dotun.jpeg',
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

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
}

export const blogs: BlogPost[] = [
  {
    id: 'transforming-data-pipelines',
    title: 'Transforming Raw Data into Actionable Pipelines',
    excerpt: 'Manual data handling is a bottleneck. Discover how automated, resilient data pipelines can accelerate your time-to-insight and reduce operational errors.',
    content: `
      <h2>The Cost of Manual Data Engineering</h2>
      <p>In the age of big data, relying on manual scripts and ad-hoc processes to move data is a recipe for disaster. It leads to data inconsistency, slow reporting cycles, and a high risk of human error.</p>
      <h3>Enter Data-Flow Delta</h3>
      <p>Our solution, <strong>Data-Flow Delta</strong>, revolutionizes this process. By automating the generation of Python scripts from natural language requirements, we help organizations build robust data pipelines in a fraction of the time.</p>
      <p>This isn't just about speed; it's about reliability. Automated pipelines ensure that your data warehouse is always fed with accurate, timely information, serving as a trustworthy single source of truth for your analytics.</p>
    `,
    date: 'January 5, 2026',
    author: 'Tajudeen Abdulazeez',
    category: 'Data Engineering',
  },
  {
    id: 'navigating-regulatory-complexity-ai',
    title: 'Navigating Regulatory Complexity with AI',
    excerpt: 'Regulatory landscapes are shifting faster than ever. Learn how AI can help your legal and compliance teams stay ahead of the curve.',
    content: `
      <h2>The Compliance Challenge</h2>
      <p>For industries like finance and healthcare, staying compliant means wading through thousands of pages of new regulations annually. The traditional method of manual review is costly and prone to oversight.</p>
      <h3>Intelligent Analysis with Regu-Assist</h3>
      <p>We developed <strong>Regu-Assist</strong> to tackle this exact problem. By leveraging Natural Language Processing (NLP), our tool analyzes complex regulatory documents and highlights the specific updates that impact your business.</p>
      <p>This allows your compliance officers to focus on strategy and mitigation rather than reading, ensuring that your organization remains secure and compliant with significantly less effort.</p>
    `,
    date: 'December 18, 2025',
    author: 'Dr. Shereef Bankole',
    category: 'AI & Compliance',
  },
  {
    id: 'future-credit-risk-assessment',
    title: 'The Future of Credit Risk Assessment',
    excerpt: 'Traditional credit scoring models are limited. AI offers a multi-dimensional approach to risk that benefits both lenders and borrowers.',
    content: `
      <h2>Beyond the FICO Score</h2>
      <p>Credit risk is complex. Traditional models often exclude worthy borrowers or fail to detect subtle signs of default risk because they look at a limited set of variables.</p>
      <h3>Smarter Lending with Credit-Wise</h3>
      <p><strong>Credit-Wise</strong> utilizes advanced machine learning algorithms to analyze a broader spectrum of financial data. By identifying non-linear patterns and correlations that humans miss, we provide a more accurate probability of default.</p>
      <p>For financial institutions, this means reduced bad debt and optimized portfolio performance. For borrowers, it means fairer access to credit based on a holistic view of their financial health.</p>
    `,
    date: 'November 22, 2025',
    author: 'Dr. Shereef Bankole',
    category: 'FinTech',
  },
  {
    id: 'ai-driven-strategic-planning',
    title: 'From Data to Wisdom: AI-Driven Strategic Planning',
    excerpt: 'Data tells you what happened. AI tells you what to do next. Unlock the power of prescriptive analytics for your business strategy.',
    content: `
      <h2>Moving Up the Analytics Maturity Curve</h2>
      <p>Most organizations are good at descriptive analytics—knowing what happened. Some are getting into predictive analytics—knowing what might happen. But the real value lies in prescriptive analytics: knowing what <em>should</em> happen.</p>
      <h3>Strategic Clarity with Intel Advisor</h3>
      <p><strong>Intel Advisor</strong> bridges this gap. By ingesting your operational data and applying AI-driven strategic models, it provides concrete recommendations to optimize efficiency and drive growth.</p>
      <p>Whether it's identifying underperforming assets or highlighting new market opportunities, Intel Advisor acts as a 24/7 strategic consultant, empowering your C-suite with data-backed confidence.</p>
    `,
    date: 'December 12, 2025',
    author: 'Dayo Adebayo',
    category: 'Business Strategy',
  },
  {
    id: 'custom-generative-ai-advantage',
    title: 'Custom Generative AI: The Key to Competitive Advantage',
    excerpt: 'Off-the-shelf LLMs are powerful, but custom-built GenAI applications tailored to your specific data unlock true enterprise value.',
    content: `
      <h2>The Limits of Generic AI</h2>
      <p>Tools like ChatGPT are generalists. While impressive, they lack the specific context of your business, your customers, and your proprietary data.</p>
      <h3>Building Bespoke Solutions</h3>
      <p>At ToraaGlobal, we specialize in <strong>GenAI Applications</strong> that are fine-tuned on your data. Imagine a customer support bot that knows your entire product history, or a coding assistant trained on your specific internal frameworks.</p>
      <p>These bespoke applications don't just answer questions; they perform tasks, automate workflows, and create new value streams that are unique to your organization, giving you a distinct competitive edge.</p>
    `,
    date: 'January 10, 2026',
    author: 'Dr. Shereef Bankole',
    category: 'Generative AI',
  },
  {
    id: 'data-lakehouse-evolution',
    title: 'The Data Lakehouse: Merging Stability with Scale',
    excerpt: 'Confused by Data Lakes and Data Warehouses? The Data Lakehouse offers the best of both worlds—combining the structure of a warehouse with the scalability of a lake.',
    content: `
      <h2>The Architecture Dilemma</h2>
      <p>For years, organizations had to choose. Do you want the structured, high-performance query capabilities of a <strong>Data Warehouse</strong>? Or do you need the massive, low-cost storage flexibility of a <strong>Data Lake</strong>?</p>
      <h3>The Unified Solution</h3>
      <p>The <strong>Data Lakehouse</strong> paradigm shifts this narrative. By adding a metadata layer over a data lake, we can achieve ACID transactions and schema enforcement without sacrificing the ability to store unstructured data.</p>
      <p>At ToraaGlobal, we help clients migrate to this modern architecture, enabling them to run BI reports and train AI models from a single, unified data source.</p>
    `,
    date: 'January 15, 2026',
    author: 'Tajudeen Abdulazeez',
    category: 'Data Architecture',
  },
  {
    id: 'real-time-warehousing',
    title: 'Real-Time Warehousing: Why Yesterday\'s Data isn\'t Good Enough',
    excerpt: 'In a hyper-connected world, waiting 24 hours for a batch report is a competitive disadvantage. Learn how moving to real-time data warehousing changes the game.',
    content: `
      <h2>The Latency Gap</h2>
      <p>Traditional data warehouses operate on nightly batch jobs. This means your "Monday morning" report is actually a reflection of Friday\'s business. In fast-paced markets, this latency is a blind spot.</p>
      <h3>Streaming into the Warehouse</h3>
      <p>Modern tools now allow us to ingest and transform data streams in real-time. Whether it\'s IoT sensor data or live financial transactions, we can make this data available for analysis seconds after it\'s generated.</p>
      <p>We implement streaming ingestion pipelines that empower your decision-makers to react to trends as they happen, not after the fact.</p>
    `,
    date: 'January 20, 2026',
    author: 'Tajudeen Abdulazeez',
    category: 'Data Warehousing',
  },
  {
    id: 'resilient-data-pipelines',
    title: 'Building Resilient Data Pipelines: A Self-Healing Approach',
    excerpt: 'Pipeline failures are inevitable. Learn how to design self-healing data workflows that automatically detect errors, retry failed tasks, and alert engineers only when necessary.',
    content: `
      <h2>The Fragility of Traditional ETL</h2>
      <p>Data pipelines often fail silently. A schema change in a source database, a network timeout, or a malformed record can bring an entire reporting infrastructure to a halt.</p>
      <h3>Designing for Failure</h3>
      <p>Resilient data engineering isn't about preventing every error—it's about handling them gracefully. By implementing dead-letter queues and automated retry policies, we ensure that transient issues don't require manual intervention.</p>
      <h3>Observability is Key</h3>
      <p>You can't fix what you can't see. We integrate comprehensive logging and monitoring into every stage of the pipeline, giving your team real-time visibility into data health and flow execution.</p>
    `,
    date: 'January 25, 2026',
    author: 'Tajudeen Abdulazeez',
    category: 'Data Engineering',
  },
];
