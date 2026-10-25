'use client';
import { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is this marketplace trustworthy?',
    a: 'Yes! We have served over 10,000 customers with a 98% satisfaction rate. All transactions are protected and we offer buyer guarantees on all purchases.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Most digital products are delivered instantly after payment confirmation. For bank transfers, delivery typically occurs within 15-30 minutes after we verify your payment.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfer (Vietcombank), e-wallets (MoMo, ZaloPay, VNPay), and account balance top-ups. All payment methods are secure and verified.',
  },
  {
    q: 'Can I get a refund?',
    a: 'Digital products are generally non-refundable once delivered. However, if the product does not match the description, please contact our support team within 24 hours for a resolution.',
  },
  {
    q: 'How does the account balance work?',
    a: 'You can top up your USAV wallet balance and use it for faster checkout. Balance top-ups are processed within 15 minutes and can be used for any purchase on the platform.',
  },
  {
    q: 'Are the game accounts safe to use?',
    a: 'All accounts listed on our platform are verified. We provide full login credentials and initial security setup guidance. We recommend changing the password immediately after purchase.',
  },
  {
    q: 'How do I contact support?',
    a: 'You can reach us by email at toanvu@usavstudio.com, by phone at +84 901 372 694, or on our Facebook page facebook.com/usavstudio.',
  },
  {
    q: 'What is the referral program?',
    a: 'Share your unique referral code with friends. When they make a purchase using your code, you earn 10% commission as reward points that can be converted to balance.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <HelpCircle size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="text-muted text-sm">Find answers to common questions</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border border-[#2a2a2a] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`text-muted transition-transform flex-shrink-0 ${
                  openIndex === index ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 -mt-1">
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
