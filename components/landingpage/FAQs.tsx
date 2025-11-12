"use client";

import { useState } from 'react';

const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const colors = {
    bgPrimary: '#D6F6FE',
    bgSecondary: '#FEE8BD',
    textPrimary: '#16263d',
    textSecondary: '#65728d',
    textMuted: '#657da8'
  };

  const faqs = [
    {
      id: 1,
      question: 'What is the minimum investment amount?',
      answer: 'You can start investing in startups with as little as $100. This makes startup investing accessible to everyone, not just accredited investors.'
    },
    {
      id: 2,
      question: 'How are startups vetted on the platform?',
      answer: 'Our expert team conducts thorough due diligence including business model validation, team assessment, market analysis, and financial review before featuring any startup.'
    },
    {
      id: 3,
      question: 'What happens after I invest?',
      answer: 'You receive equity shares in the startup and regular updates on their progress. You can track your investments through your dashboard and participate in investor updates.'
    },
    {
      id: 4,
      question: 'How do competitions work?',
      answer: 'Startups participate in themed competitions where they showcase their solutions. Winners get featured placement, additional funding opportunities, and increased investor visibility.'
    },
    {
      id: 5,
      question: 'Is my investment secure?',
      answer: 'All transactions are processed through secure, encrypted payment gateways. We use bank-level security and compliance standards to protect your investments and personal data.'
    },
    {
      id: 6,
      question: 'Can I diversify my portfolio?',
      answer: 'Absolutely! We recommend diversifying across different industries, stages, and investment amounts. Our platform makes it easy to build a balanced startup portfolio.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
               style={{ backgroundColor: colors.bgPrimary }}>
            <span className="text-2xl">❓</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: colors.textPrimary }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: colors.textSecondary }}>
            Got questions? We've got answers. Find everything you need to know about investing with GrowIn.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-300"
              style={{ 
                borderColor: openFAQ === faq.id ? colors.textPrimary : colors.textMuted + '30',
                boxShadow: openFAQ === faq.id ? `0 10px 30px ${colors.textPrimary}15` : '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <button
                className="w-full text-left p-6 lg:p-8 focus:outline-none group"
                onClick={() => toggleFAQ(faq.id)}
                style={{ backgroundColor: openFAQ === faq.id ? colors.bgPrimary + '20' : 'transparent' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg lg:text-xl font-semibold pr-8 group-hover:text-opacity-80 transition-all duration-300"
                      style={{ color: colors.textPrimary }}>
                    {faq.question}
                  </h3>
                  <div 
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFAQ === faq.id ? 'rotate-180' : 'rotate-0'
                    }`}
                    style={{ backgroundColor: colors.textPrimary }}
                  >
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                  <p className="text-base lg:text-lg leading-relaxed" style={{ color: colors.textMuted }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-base mb-6" style={{ color: colors.textSecondary }}>
            Still have questions?
          </p>
          <button 
            className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 border-2"
            style={{ 
              color: colors.textPrimary,
              backgroundColor: 'transparent',
              borderColor: colors.textPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.textPrimary;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textPrimary;
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQs;