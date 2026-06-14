'use client'

import React from 'react'
import { useNavigation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { X, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail } from 'lucide-react'

const legalTabs = ['about', 'privacy', 'terms', 'disclaimer', 'contact'] as const
type LegalTab = typeof legalTabs[number]

const tabLabels: Record<LegalTab, string> = {
  about: 'About',
  privacy: 'Privacy',
  terms: 'Terms',
  disclaimer: 'Disclaimer',
  contact: 'Contact',
}

const legalContent: Record<LegalTab, { title: string; content: React.ReactNode }> = {
  about: {
    title: 'About Us',
    content: (
      <div className="article-body space-y-6">
        <p>
          Digital Point Pro is a premier knowledge and trends platform dedicated to bringing
          you the latest insights in technology, business, finance, and personal development.
          Founded with the mission of making expert knowledge accessible to everyone, we cover
          topics ranging from Artificial Intelligence and Cybersecurity to Personal Finance and
          Remote Work.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our team of experienced writers and industry professionals carefully research and craft
          each article to ensure accuracy, relevance, and actionable insights. Whether you&apos;re
          a tech enthusiast, a budding entrepreneur, or someone looking to improve their
          productivity, Digital Point Pro has something for you.
        </p>
        <h2>Our Values</h2>
        <p>
          We believe that knowledge should be free, accessible, and practical. That&apos;s why
          every article we publish is designed to not just inform, but to empower you to take
          action and make better decisions in your personal and professional life.
        </p>
        <h2>What We Cover</h2>
        <ul>
          <li><strong>Technology</strong> — AI, Cybersecurity, Cloud Computing, and emerging tech trends</li>
          <li><strong>Business</strong> — Entrepreneurship, Leadership, Marketing, and Strategy</li>
          <li><strong>Finance</strong> — Personal Finance, Investing, Cryptocurrency, and Financial Planning</li>
          <li><strong>Health & Wellness</strong> — Mental Health, Fitness, Nutrition, and Work-Life Balance</li>
          <li><strong>Lifestyle</strong> — Productivity, Remote Work, Personal Development, and Career Growth</li>
        </ul>
        <h2>Our Team</h2>
        <p>
          Our diverse team comprises technology experts, business analysts, financial advisors,
          and lifestyle coaches who bring years of industry experience to every article. Each
          piece is thoroughly researched, fact-checked, and reviewed to maintain the highest
          editorial standards.
        </p>
      </div>
    ),
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="article-body space-y-6">
        <p><em>Last updated: January 2025</em></p>
        <p>
          At Digital Point Pro, we take your privacy seriously. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, and other contact details you voluntarily provide when subscribing to our newsletter or contacting us.</li>
          <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent on pages, and navigation patterns.</li>
          <li><strong>Device Information:</strong> Browser type, operating system, device type, and IP address.</li>
        </ul>
        <h2>Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience.
          These include essential cookies for website functionality, analytics cookies to understand
          how visitors interact with our site, and advertising cookies to deliver relevant ads.
        </p>
        <h2>Third-Party Services</h2>
        <p>We use the following third-party services that may collect your information:</p>
        <ul>
          <li><strong>Google AdSense:</strong> For displaying advertisements. Google may use cookies to serve ads based on your prior visits.</li>
          <li><strong>Google Analytics:</strong> For website analytics and performance tracking.</li>
          <li><strong>Social Media Platforms:</strong> For sharing features and embedded content.</li>
        </ul>
        <h2>Data Protection</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          data against unauthorized access, alteration, disclosure, or destruction. However, no
          method of transmission over the Internet is 100% secure.
        </p>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal data</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@digitalpointpro.com">privacy@digitalpointpro.com</a>.
        </p>
      </div>
    ),
  },
  terms: {
    title: 'Terms and Conditions',
    content: (
      <div className="article-body space-y-6">
        <p><em>Last updated: January 2025</em></p>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using Digital Point Pro, you accept and agree to be bound by these
          Terms and Conditions. If you do not agree with any part of these terms, you must not
          use our website.
        </p>
        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily access the materials on Digital Point Pro for
          personal, non-commercial transitory viewing only. This is the grant of a license, not
          a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to decompile or reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
        </ul>
        <h2>Content Ownership</h2>
        <p>
          All content published on Digital Point Pro, including articles, images, graphics, and
          other materials, is the property of Digital Point Pro and is protected by copyright
          laws. Unauthorized use, reproduction, or distribution of our content is strictly
          prohibited.
        </p>
        <h2>User Responsibilities</h2>
        <p>As a user of our website, you agree to:</p>
        <ul>
          <li>Use the website only for lawful purposes</li>
          <li>Not attempt to gain unauthorized access to any portion of the website</li>
          <li>Not interfere with or disrupt the website or servers connected to it</li>
          <li>Not use automated means to access or collect data from the website</li>
        </ul>
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Digital Point Pro or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business
          interruption) arising out of the use or inability to use the materials on the website,
          even if Digital Point Pro has been notified orally or in writing of the possibility of
          such damage.
        </p>
        <h2>Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with applicable
          laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that
          location.
        </p>
      </div>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    content: (
      <div className="article-body space-y-6">
        <p><em>Last updated: January 2025</em></p>
        <h2>General Information</h2>
        <p>
          The information provided on Digital Point Pro is for general informational and
          educational purposes only. All information on the site is provided in good faith;
          however, we make no representation or warranty of any kind, express or implied,
          regarding the accuracy, adequacy, validity, reliability, availability, or completeness
          of any information on the site.
        </p>
        <h2>No Professional Advice</h2>
        <p>
          The content on Digital Point Pro does not constitute professional advice of any kind,
          including but not limited to financial, legal, medical, or technical advice. You should
          always consult with a qualified professional before making any decisions based on the
          information provided on this website.
        </p>
        <h2>Affiliate Links</h2>
        <p>
          Some links on Digital Point Pro may be affiliate links. This means that if you click on
          the link and make a purchase, we may receive a small commission at no additional cost to
          you. These commissions help us maintain and operate this website. We only recommend
          products and services we genuinely believe in.
        </p>
        <h2>Third-Party Content</h2>
        <p>
          Our website may contain links to third-party websites or content that is not owned or
          controlled by Digital Point Pro. We have no control over, and assume no responsibility
          for, the content, privacy policies, or practices of any third-party websites.
        </p>
        <h2>Changes to Content</h2>
        <p>
          Digital Point Pro reserves the right to add, modify, or remove any content on the
          website at any time without prior notice. We are not obligated to update any information
          on the site.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          Under no circumstances shall Digital Point Pro be liable for any loss or damage,
          including without limitation, indirect or consequential loss or damage, arising from or
          in connection with the use of this website.
        </p>
      </div>
    ),
  },
  contact: {
    title: 'Contact Us',
    content: (
      <div className="article-body space-y-6">
        <p>
          We&apos;d love to hear from you! Whether you have a question, suggestion, or just want
          to say hello, feel free to reach out using any of the methods below.
        </p>
        <h2>Get in Touch</h2>
        <div className="space-y-4 not-prose">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <a href="mailto:contact@digitalpointpro.com" className="text-sm text-primary hover:underline">
                contact@digitalpointpro.com
              </a>
            </div>
          </div>
        </div>
        <h2>Send Us a Message</h2>
        <div className="not-prose space-y-4 max-w-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Subject</label>
            <Input placeholder="How can we help?" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <Textarea placeholder="Your message..." rows={5} />
          </div>
          <Button className="w-full sm:w-auto">Send Message</Button>
        </div>
        <h2>Follow Us</h2>
        <p>
          Stay connected by following us on social media for the latest updates, articles, and
          insights.
        </p>
        <ul>
          <li>Facebook: @DigitalPointPro</li>
          <li>Twitter: @DigitalPointPro</li>
          <li>LinkedIn: Digital Point Pro</li>
          <li>YouTube: Digital Point Pro</li>
        </ul>
      </div>
    ),
  },
}

interface StaticPageOverlayProps {
  type: OverlayType
}

function getInitialTab(data: string | null): LegalTab {
  if (data && legalTabs.includes(data as LegalTab)) {
    return data as LegalTab
  }
  return 'about'
}

export default function StaticPageOverlay({ type }: StaticPageOverlayProps) {
  const { closeOverlay, overlayData } = useNavigation()
  const initialTab = getInitialTab(overlayData)
  const [activeTab, setActiveTab] = React.useState<LegalTab>(initialTab)

  if (type !== 'legal') return null

  return (
    <div className="fixed inset-0 z-50 bg-background overlay-enter">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={closeOverlay}
              className="hover:text-foreground transition-colors"
            >
              Home
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Legal & About</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closeOverlay}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 49px)' }}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
            Legal & About
          </h1>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LegalTab)}>
            <TabsList className="mb-8 flex-wrap h-auto gap-1 p-1">
              {legalTabs.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="text-sm">
                  {tabLabels[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            {legalTabs.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  {legalContent[tab].title}
                </h2>
                {legalContent[tab].content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
