'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'Is it safe to buy game accounts here?',
    answer: 'Yes! All our accounts are verified and come with a warranty. We use secure trading methods and our platform has served thousands of satisfied customers.',
  },
  {
    question: 'How fast is delivery?',
    answer: 'Most digital products are delivered instantly after payment confirmation. For accounts and special services, delivery typically takes 5-30 minutes.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers, e-wallets, and various digital payment methods. All transactions are processed securely.',
  },
  {
    question: 'What if I have issues with my purchase?',
    answer: 'Our 24/7 support team is always ready to help. Contact us through live chat, Discord, or email. We offer refunds and replacements for any issues.',
  },
  {
    question: 'Can I sell my account on USAV?',
    answer: 'Currently we only support buying through our platform. Contact our team if you are interested in selling.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-white text-sm font-medium pr-4">{faq.question}</span>
              <ChevronDown
                size={18}
                className={cn(
                  'text-muted shrink-0 transition-transform duration-200',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-muted text-sm leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
