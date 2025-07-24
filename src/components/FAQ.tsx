import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the escrow system work?",
      answer: "Our smart contract automatically locks project funds when a project is posted. The funds remain secure in escrow until the student completes the work and the DAO community verifies the deliverables meet the project requirements. Only then are the funds released to the student, ensuring both parties are protected."
    },
    {
      question: "What are DAO fees and how much do they cost?",
      answer: "UniversityDAO charges a 3-5% fee on completed projects. This fee covers platform maintenance, smart contract operations, DAO governance activities, and community verification processes. The exact percentage depends on project complexity and value."
    },
    {
      question: "What are reputation tokens and how do I earn them?",
      answer: "Reputation tokens are blockchain-based credentials that track your performance and reliability on the platform. Students earn them by completing projects successfully, receiving positive feedback, and meeting deadlines. Employers earn reputation through fair project postings and timely payments. High reputation unlocks better opportunities and lower fees."
    },
    {
      question: "How does DAO verification work?",
      answer: "The Decentralized Autonomous Organization (DAO) consists of platform stakeholders who review completed work against project requirements. Multiple community members vote on whether deliverables meet the specified criteria. This decentralized approach ensures fair and unbiased project evaluation."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "Disputes are resolved through DAO voting mechanisms. Community members review evidence from both parties and vote on the outcome. The majority decision determines whether funds are released, returned, or distributed partially. This transparent process ensures fair conflict resolution."
    },
    {
      question: "Can students initiate their own projects?",
      answer: "Yes! Students can propose their own projects and seek funding from investors through our platform. This feature encourages entrepreneurship and allows students to showcase innovative ideas while potentially securing investment for their startups."
    },
    {
      question: "Are there any geographic restrictions?",
      answer: "Currently, we're focused on English-speaking regions, but we're planning multi-currency support and regional expansion in our maturation phase. We aim to create a global marketplace for student talent and project opportunities."
    },
    {
      question: "How do I protect confidential company information?",
      answer: "We provide NDA templates and secure document sharing through decentralized file storage. All project communications are encrypted, and we offer privacy controls to prevent sharing of confidential information. Companies can set specific confidentiality requirements for each project."
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about UniversityDAO's blockchain-powered platform for student work and internships.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;