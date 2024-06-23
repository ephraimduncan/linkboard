export const getBookmarks = () => {
  return [
    {
      id: 1,
      title: "Introduction to React",
      url: "https://reactjs.org/tutorial/tutorial.html",
      description: "Official React tutorial for beginners",
      tags: ["react", "javascript", "frontend"],
      createdAt: "2024-06-20T14:30:00Z",
    },
    {
      id: 2,
      title: "Python Data Science Handbook",
      url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
      description: "Free online book for data science with Python",
      tags: ["python", "data-science", "machine-learning"],
      createdAt: "2024-06-21T09:15:00Z",
      username: "duncan",
    },
    {
      id: 3,
      title: "The Ultimate Guide to CSS Grid",
      url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      description: "Comprehensive guide to CSS Grid layout",
      tags: ["css", "web-design", "frontend"],
      createdAt: "2024-06-22T11:45:00Z",
    },
    {
      id: 4,
      title: "Git Branching Strategies",
      url: "https://nvie.com/posts/a-successful-git-branching-model/",
      description: "Popular Git workflow for managing branches",
      tags: ["git", "version-control", "development"],
      createdAt: "2024-06-23T08:00:00Z",
    },
    {
      id: 5,
      title: "TypeScript Deep Dive",
      url: "https://basarat.gitbook.io/typescript/",
      description: "Comprehensive guide to TypeScript",
      tags: ["typescript", "javascript", "programming"],
      createdAt: "2024-06-24T10:20:00Z",
    },
    {
      id: 6,
      title: "Docker for Beginners",
      url: "https://docker-curriculum.com/",
      description: "Learn Docker basics and containerization",
      tags: ["docker", "devops", "containers"],
      createdAt: "2024-06-25T13:45:00Z",
      username: "sarah",
    },
    {
      id: 7,
      title: "Machine Learning Crash Course",
      url: "https://developers.google.com/machine-learning/crash-course",
      description: "Google's fast-paced, practical introduction to machine learning",
      tags: ["machine-learning", "ai", "data-science"],
      createdAt: "2024-06-26T09:30:00Z",
    },
    {
      id: 8,
      title: "The Rust Programming Language",
      url: "https://doc.rust-lang.org/book/",
      description: "Official book for learning Rust",
      tags: ["rust", "programming", "systems"],
      createdAt: "2024-06-27T16:15:00Z",
    },
    {
      id: 9,
      title: "Web Security Academy",
      url: "https://portswigger.net/web-security",
      description: "Free online web security training from PortSwigger",
      tags: ["security", "web", "hacking"],
      createdAt: "2024-06-28T11:00:00Z",
      username: "alice",
    },
    {
      id: 10,
      title: "Vue.js 3 Documentation",
      url: "https://v3.vuejs.org/guide/introduction.html",
      description: "Official Vue.js 3 guide and documentation",
      tags: ["vue", "javascript", "frontend"],
      createdAt: "2024-06-29T14:50:00Z",
    },
    {
      id: 11,
      title: "Algorithms and Data Structures in Python",
      url: "https://www.programiz.com/dsa/algorithm",
      description: "Learn algorithms and data structures using Python",
      tags: ["algorithms", "data-structures", "python"],
      createdAt: "2024-06-30T08:25:00Z",
    },
    {
      id: 12,
      title: "GraphQL: The Complete Guide",
      url: "https://www.howtographql.com/",
      description: "Comprehensive tutorial for GraphQL",
      tags: ["graphql", "api", "backend"],
      createdAt: "2024-07-01T12:10:00Z",
      username: "bob",
    },
    {
      id: 13,
      title: "Responsive Web Design Fundamentals",
      url: "https://web.dev/responsive-web-design-basics/",
      description: "Learn the basics of responsive web design",
      tags: ["responsive-design", "css", "web-development"],
      createdAt: "2024-07-02T15:30:00Z",
    },
    {
      id: 14,
      title: "Kubernetes: Up and Running",
      url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      description: "Official Kubernetes tutorial for beginners",
      tags: ["kubernetes", "devops", "containers"],
      createdAt: "2024-07-03T09:45:00Z",
    },
    {
      id: 15,
      title: "The Pragmatic Programmer",
      url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      description: "Essential reading for software developers",
      tags: ["career", "software-development", "best-practices"],
      createdAt: "2024-07-04T11:20:00Z",
    },
    {
      id: 16,
      title: "Hacker News",
      url: "https://news.ycombinator.com/",
      description: "Social news website focusing on computer science and entrepreneurship",
      tags: ["tech-news", "startups", "discussion"],
      createdAt: "2024-07-05T08:15:00Z",
      username: "techie",
    },
    {
      id: 17,
      title: "Stack Overflow Annual Developer Survey",
      url: "https://insights.stackoverflow.com/survey",
      description: "Comprehensive annual survey of developers worldwide",
      tags: ["developer-insights", "trends", "statistics"],
      createdAt: "2024-07-06T14:30:00Z",
    },
    {
      id: 18,
      title: "The Pomodoro Technique",
      url: "https://francescocirillo.com/pages/pomodoro-technique",
      description: "Time management method for improved productivity",
      tags: ["productivity", "time-management", "work-technique"],
      createdAt: "2024-07-07T10:45:00Z",
    },
    {
      id: 19,
      title: "TechCrunch",
      url: "https://techcrunch.com/",
      description:
        "Leading technology media property, dedicated to obsessively profiling startups, reviewing new Internet products, and breaking tech news",
      tags: ["tech-news", "startups", "industry"],
      createdAt: "2024-07-08T09:00:00Z",
    },
    {
      id: 20,
      title: "Exercism",
      url: "https://exercism.io/",
      description: "Free coding practice and mentorship for popular programming languages",
      tags: ["coding-practice", "mentorship", "learning"],
      createdAt: "2024-07-09T16:20:00Z",
      username: "coder123",
    },
    {
      id: 21,
      title: "The Joel Test: 12 Steps to Better Code",
      url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/",
      description: "A simple test to rate the quality of a software team",
      tags: ["software-development", "best-practices", "team-management"],
      createdAt: "2024-07-10T13:10:00Z",
    },
    {
      id: 22,
      title: "Indie Hackers",
      url: "https://www.indiehackers.com/",
      description:
        "Community of independent developers sharing their experiences in building profitable online businesses",
      tags: ["entrepreneurship", "startups", "community"],
      createdAt: "2024-07-11T11:30:00Z",
    },
    {
      id: 23,
      title: "Developer Tea Podcast",
      url: "https://developertea.com/",
      description: "Podcast for developers designed to fit inside your tea break",
      tags: ["podcast", "career-development", "soft-skills"],
      createdAt: "2024-07-12T15:45:00Z",
    },
    {
      id: 24,
      title: "The Changelog",
      url: "https://changelog.com/",
      description: "News and podcasts for developers",
      tags: ["tech-news", "podcast", "open-source"],
      createdAt: "2024-07-13T09:20:00Z",
      username: "devfan",
    },
    {
      id: 25,
      title: "A List Apart",
      url: "https://alistapart.com/",
      description:
        "Explores the design, development, and meaning of web content, with a special focus on web standards and best practices",
      tags: ["web-design", "ux", "content-strategy"],
      createdAt: "2024-07-14T12:00:00Z",
    },
    {
      id: 26,
      title: "Zen and the Art of Motorcycle Maintenance",
      url: "https://www.goodreads.com/book/show/629.Zen_and_the_Art_of_Motorcycle_Maintenance",
      description: "A book that explores the relationship between people, technology, and quality",
      tags: ["philosophy", "technology", "quality"],
      createdAt: "2024-07-15T14:30:00Z",
    },
    {
      id: 27,
      title: "Stack Overflow Blog",
      url: "https://stackoverflow.blog/",
      description: "Company blog for Stack Overflow, covering programming, technology, and the developer community",
      tags: ["tech-blog", "programming", "community"],
      createdAt: "2024-07-16T10:15:00Z",
    },
    {
      id: 28,
      title: "Coursera - Learning How to Learn",
      url: "https://www.coursera.org/learn/learning-how-to-learn",
      description: "Free online course about the science of learning, to help you master tough subjects",
      tags: ["learning-techniques", "personal-development", "productivity"],
      createdAt: "2024-07-17T08:45:00Z",
      username: "lifelong_learner",
    },
    {
      id: 29,
      title: "Harvard Business Review - Technology Articles",
      url: "https://hbr.org/topic/technology",
      description: "Articles on technology and its impact on business from a leading business publication",
      tags: ["business", "technology", "management"],
      createdAt: "2024-07-18T16:00:00Z",
    },
    {
      id: 30,
      title: "Basecamp's 'Shape Up' Method",
      url: "https://basecamp.com/shapeup",
      description: "A guide to Basecamp's unique approach to product development and project management",
      tags: ["project-management", "product-development", "agile"],
      createdAt: "2024-07-19T11:30:00Z",
    },
    {
      id: 31,
      title: "DEV Community",
      url: "https://dev.to/",
      description: "A constructive and inclusive social network for software developers",
      tags: ["community", "blogging", "networking"],
      createdAt: "2024-07-20T09:00:00Z",
      username: "devnetworker",
    },
    {
      id: 32,
      title: "Code: The Hidden Language of Computer Hardware and Software",
      url: "https://www.goodreads.com/book/show/44882.Code",
      description: "A book that demystifies the hidden world of computers and software",
      tags: ["computer-science", "hardware", "software"],
      createdAt: "2024-07-21T13:45:00Z",
    },
    {
      id: 33,
      title: "World Economic Forum - Fourth Industrial Revolution",
      url: "https://www.weforum.org/focus/fourth-industrial-revolution",
      description: "Exploring the impact of emerging technologies on society and the economy",
      tags: ["future-tech", "society", "economy"],
      createdAt: "2024-07-22T10:30:00Z",
    },
    {
      id: 34,
      title: "MIT Technology Review",
      url: "https://www.technologyreview.com/",
      description:
        "Technology news source that analyzes new technologies and their commercial, social, and political impacts",
      tags: ["tech-news", "innovation", "research"],
      createdAt: "2024-07-23T15:15:00Z",
    },
  ];
};