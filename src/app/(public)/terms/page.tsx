'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function TermsPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              Last Updated: October 13, 2025
            </p>

            {/* Agreement to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Agreement to Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing or using PulseBridge.ai ("Platform", "Service", "we", "us", or "our"), 
                you ("User", "you", or "your") agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, do not use the Platform.
              </p>
            </section>

            {/* Service Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                PulseBridge.ai is an AI-powered marketing automation platform that provides:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Campaign management across multiple advertising platforms (Google Ads, Meta, LinkedIn)</li>
                <li>AI-driven campaign optimization and performance analysis</li>
                <li>Automated budget allocation and bid management</li>
                <li>Real-time analytics and reporting</li>
                <li>Integration with third-party marketing and advertising platforms</li>
              </ul>
            </section>

            {/* Account Requirements */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Account Requirements
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Eligibility</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>You must be at least 18 years old</li>
                <li>You must have legal authority to enter into binding contracts</li>
                <li>You must not be prohibited from using the service under applicable laws</li>
                <li>Your use must comply with all applicable laws and regulations</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Account Registration</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of unauthorized account access</li>
                <li>You are responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Account Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">We reserve the right to suspend or terminate accounts that:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Abuse or misuse the Platform</li>
                <li>Pose security risks to our systems or other users</li>
                <li>Are inactive for extended periods</li>
              </ul>
            </section>

            {/* User Obligations */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                User Obligations and Restrictions
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Permitted Use</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">You may use the Platform to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Create and manage legitimate marketing campaigns</li>
                <li>Analyze campaign performance and generate reports</li>
                <li>Integrate with authorized third-party platforms</li>
                <li>Collaborate with team members within your organization</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Prohibited Activities</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">You may NOT:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Illegal Content:</strong> Promote illegal products, services, or activities</li>
                <li><strong>Fraud:</strong> Create deceptive or misleading campaigns or advertisements</li>
                <li><strong>Malicious Use:</strong> Distribute malware, viruses, or harmful code</li>
                <li><strong>Unauthorized Access:</strong> Attempt to bypass security measures or access restricted areas</li>
                <li><strong>Reverse Engineering:</strong> Decompile, disassemble, or reverse engineer the Platform</li>
                <li><strong>Data Scraping:</strong> Use automated tools to extract data without authorization</li>
                <li><strong>Spam:</strong> Send unsolicited communications through our Platform</li>
                <li><strong>Impersonation:</strong> Misrepresent your identity or affiliation</li>
                <li><strong>Platform Abuse:</strong> Overload systems, disrupt service, or harm infrastructure</li>
                <li><strong>Resale:</strong> Resell or redistribute access to the Platform without authorization</li>
                <li><strong>Competitive Intelligence:</strong> Use the Platform to build competing products</li>
                <li><strong>Prohibited Content:</strong> Adult content, gambling, drugs, weapons, hate speech, or other content prohibited by advertising platforms</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Payment Terms
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Subscription Plans</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Pricing is subject to your selected subscription plan</li>
                <li>Fees are non-refundable except as required by law or specified in refund policy</li>
                <li>Prices may change with 30 days notice to active subscribers</li>
                <li>Currency conversion fees may apply for international transactions</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Billing</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Charges are billed in advance on a recurring basis (monthly or annually)</li>
                <li>Payment must be made by credit card, debit card, or approved payment method</li>
                <li>You authorize recurring charges to your payment method</li>
                <li>Failure to pay may result in service suspension or termination</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Advertising Spend</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Advertising platform costs (Google Ads, Meta, etc.) are separate from Platform fees</li>
                <li>You are responsible for all advertising spend incurred through the Platform</li>
                <li>We do not charge commissions on your advertising spend</li>
                <li>Budget limits and caps you set are enforced on a best-effort basis</li>
                <li>Final billing is determined by advertising platforms, not by us</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Refund Policy</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Subscription fees are non-refundable except within 7 days of initial purchase</li>
                <li>Pro-rated refunds not available for mid-cycle cancellations</li>
                <li>Unused subscription time does not carry forward after cancellation</li>
                <li>Refunds processed within 10 business days of approved request</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Intellectual Property Rights
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Our Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">We own all rights to:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Platform software, code, and architecture</li>
                <li>User interface designs and layouts</li>
                <li>AI models and algorithms (excluding third-party models)</li>
                <li>Platform documentation and content</li>
                <li>Trademarks, logos, and branding</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Your Rights</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">You retain ownership of:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Your campaign content and creative materials</li>
                <li>Your business data and customer information</li>
                <li>Your marketing strategies and methodologies</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">License Grant</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform according to these Terms for your legitimate business purposes. You grant us a limited license to store, process, and transmit your content to provide services and use aggregate, anonymized data for service improvement.
              </p>
            </section>

            {/* AI and Automation */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                AI and Automation
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">AI Services</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>AI features are provided "as-is" and may produce variable results</li>
                <li>AI recommendations are suggestions, not guarantees of performance</li>
                <li>You are responsible for reviewing and approving AI-generated content</li>
                <li>AI decisions may require human oversight depending on your settings</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Autonomous Mode</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">When enabling autonomous AI operations:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>You authorize the AI to make campaign changes within specified parameters</li>
                <li>You set budget limits, performance thresholds, and safety guardrails</li>
                <li>You can disable autonomous mode at any time</li>
                <li>You remain ultimately responsible for all campaign decisions and costs</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">AI Limitations</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>AI performance depends on data quality and market conditions</li>
                <li>Results may vary based on industry, competition, and timing</li>
                <li>We do not guarantee specific performance outcomes</li>
                <li>AI may make errors or suboptimal decisions requiring human intervention</li>
              </ul>
            </section>

            {/* Third-Party Platform Integrations */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Third-Party Platform Integrations
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Platform Connections</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>You authorize us to access third-party platforms on your behalf</li>
                <li>You must comply with third-party platform terms of service</li>
                <li>We are not responsible for third-party platform changes, outages, or policy violations</li>
                <li>Connection issues may limit Platform functionality</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Platform Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Google Ads:</strong> Comply with Google Ads policies and guidelines</li>
                <li><strong>Meta (Facebook/Instagram):</strong> Follow Meta advertising policies</li>
                <li><strong>LinkedIn:</strong> Adhere to LinkedIn marketing solutions policies</li>
                <li>You are responsible for maintaining appropriate credentials and permissions</li>
              </ul>
            </section>

            {/* Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Protection and Privacy
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Data Processing</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>We process your data according to our Privacy Policy</li>
                <li>You consent to data processing necessary for service delivery</li>
                <li>Data is encrypted in transit and at rest</li>
                <li>We implement industry-standard security measures</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Your Data Responsibilities</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Ensure you have rights to all data you upload</li>
                <li>Do not upload sensitive personal information unless necessary</li>
                <li>Comply with applicable data protection laws (GDPR, CCPA, etc.)</li>
                <li>Obtain necessary consents for marketing communications</li>
              </ul>
            </section>

            {/* Warranties and Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Warranties and Disclaimers
              </h2>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  DISCLAIMER OF WARRANTIES
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
                  THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 text-yellow-700 dark:text-yellow-300">
                  <li><strong>MERCHANTABILITY:</strong> No guarantee Platform is suitable for any particular purpose</li>
                  <li><strong>FITNESS:</strong> No guarantee Platform meets your specific requirements</li>
                  <li><strong>NON-INFRINGEMENT:</strong> No guarantee Platform does not violate third-party rights</li>
                  <li><strong>UNINTERRUPTED ACCESS:</strong> Services may experience downtime or interruptions</li>
                  <li><strong>ERROR-FREE OPERATION:</strong> Bugs and errors may occur</li>
                  <li><strong>SECURITY:</strong> No system is completely secure; breaches may occur</li>
                  <li><strong>RESULTS:</strong> No guarantee of campaign performance or ROI</li>
                  <li><strong>AI ACCURACY:</strong> AI predictions and recommendations may be incorrect</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  LIABILITY CAP
                </h3>
                <p className="text-red-700 dark:text-red-300 font-semibold mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY SHALL NOT EXCEED THE LESSER OF:
                </p>
                <ul className="list-disc pl-6 text-red-700 dark:text-red-300 mb-4">
                  <li>Fees paid by you in the 12 months preceding the claim, OR</li>
                  <li>$10,000 USD</li>
                </ul>
                
                <h4 className="text-md font-semibold text-red-800 dark:text-red-200 mb-2">
                  EXCLUDED DAMAGES - WE ARE NOT LIABLE FOR:
                </h4>
                <ul className="list-disc pl-6 text-red-700 dark:text-red-300">
                  <li><strong>Indirect Damages:</strong> Lost profits, revenue, data, or business opportunities</li>
                  <li><strong>Consequential Damages:</strong> Costs of substitute services or lost goodwill</li>
                  <li><strong>Punitive Damages:</strong> Penalties or exemplary damages</li>
                  <li><strong>Campaign Performance:</strong> Poor ROI, failed campaigns, or advertising losses</li>
                  <li><strong>Third-Party Actions:</strong> Actions of advertising platforms, competitors, or other third parties</li>
                  <li><strong>AI Errors:</strong> Incorrect AI recommendations or automated decisions</li>
                  <li><strong>Data Loss:</strong> Loss of data not caused by our gross negligence</li>
                  <li><strong>Security Breaches:</strong> Damages from unauthorized access despite reasonable security</li>
                </ul>
              </div>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Indemnification
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to indemnify, defend, and hold harmless PulseBridge.ai, its officers, directors, employees, and agents from claims, damages, losses, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Your violation of these Terms</li>
                <li>Your violation of third-party rights</li>
                <li>Your content or campaigns violating laws or regulations</li>
                <li>Your advertising platform policy violations</li>
                <li>Misuse or unauthorized use of your account</li>
                <li>Your data processing or privacy law violations</li>
              </ul>
            </section>

            {/* Service Availability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Service Availability
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Uptime Commitment</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>We target 99.5% uptime excluding scheduled maintenance</li>
                <li>Scheduled maintenance will be announced 48 hours in advance</li>
                <li>Emergency maintenance may occur with shorter notice</li>
              </ul>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>No SLA Guarantee:</strong> Unless you have a separate Enterprise Service Level Agreement, uptime targets are goals, not guarantees. We are not liable for service interruptions or downtime.
              </p>
            </section>

            {/* Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Modifications to Service and Terms
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Service Changes</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">We may:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Modify, suspend, or discontinue features with notice</li>
                <li>Update pricing with 30 days notice to existing subscribers</li>
                <li>Change technical specifications to improve service</li>
                <li>Remove features that are no longer viable</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Terms Changes</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>We may update these Terms periodically</li>
                <li>Material changes will be notified via email and platform notification</li>
                <li>Continued use after changes constitutes acceptance</li>
                <li>If you disagree with changes, you may terminate your account</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Termination
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Termination by You</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Cancel your subscription at any time through account settings</li>
                <li>Cancellation effective at end of billing period</li>
                <li>No refunds for unused subscription time</li>
                <li>Data export available for 30 days after cancellation</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Termination by Us</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">We may terminate or suspend your account immediately if:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>You breach these Terms</li>
                <li>You engage in prohibited activities</li>
                <li>Your account poses security risks</li>
                <li>You fail to pay fees</li>
                <li>Required by law or court order</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Effect of Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">Upon termination:</p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Your access to the Platform is immediately revoked</li>
                <li>All data will be deleted after 30-day grace period</li>
                <li>Outstanding fees become immediately due</li>
                <li>Provisions intended to survive termination remain in effect</li>
              </ul>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Dispute Resolution
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Informal Resolution</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Before initiating formal proceedings, contact us at legal@pulsebridge.ai to describe the dispute. 
                We will attempt good-faith resolution within 30 days. Formal proceedings may only begin after informal resolution attempts.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  BINDING ARBITRATION
                </h3>
                <p className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
                  BY AGREEING TO THESE TERMS, YOU AGREE THAT:
                </p>
                <ul className="list-disc pl-6 text-blue-700 dark:text-blue-300">
                  <li>Disputes will be resolved by binding arbitration</li>
                  <li>Arbitration will be conducted by JAMS under Commercial Arbitration Rules</li>
                  <li>You waive the right to jury trial</li>
                  <li>You waive the right to participate in class actions</li>
                </ul>
              </div>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Class Action Waiver</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You agree to arbitrate disputes individually, not as a class member or representative in any class, collective, or representative proceeding.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Governing Law
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                These Terms are governed by applicable laws without regard to conflict of law provisions. You consent to exclusive jurisdiction for any disputes not subject to arbitration.
              </p>
            </section>

            {/* General Provisions */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                General Provisions
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Entire Agreement</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                These Terms, Privacy Policy, and any referenced policies constitute the entire agreement between you and PulseBridge.ai.
              </p>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Key Provisions</h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Assignment:</strong> You may not assign these Terms without our consent</li>
                <li><strong>Severability:</strong> If any provision is unenforceable, remaining provisions remain in effect</li>
                <li><strong>No Waiver:</strong> Failure to enforce any provision does not waive our right to enforce it later</li>
                <li><strong>Force Majeure:</strong> We are not liable for failures caused by events beyond our reasonable control</li>
                <li><strong>Export Control:</strong> You agree to comply with export control laws</li>
                <li><strong>Independent Contractors:</strong> These Terms do not create partnership or employment relationships</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">General Inquiries</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> support@pulsebridge.ai<br />
                    <strong>Website:</strong> https://pulsebridge.ai
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Legal Matters</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> legal@pulsebridge.ai
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Security Issues</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> security@pulsebridge.ai<br />
                    <strong>Response:</strong> Within 24 hours
                  </p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Acknowledgment
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                BY USING PULSEBRIDGE.AI, YOU ACKNOWLEDGE THAT:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>You have read and understood these Terms of Service</li>
                <li>You agree to be bound by these Terms</li>
                <li>You have authority to accept these Terms on behalf of your organization (if applicable)</li>
                <li>You understand the limitations of liability and warranty disclaimers</li>
                <li>You agree to the dispute resolution and arbitration provisions</li>
              </ul>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Last Reviewed:</strong> October 13, 2025<br />
                  <strong>Version:</strong> 2.0
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}