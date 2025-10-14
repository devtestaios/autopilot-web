'use client';

import React from 'react';
import { useTheme } from 'next-themes';

export default function PrivacyPolicyPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last Updated: October 13, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                PulseBridge.ai ("we," "our," or "us") operates an AI-powered marketing automation platform. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our platform and services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Information You Provide
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, company name, phone number, billing information</li>
                <li><strong>Campaign Data:</strong> Marketing campaigns, ad creative, targeting parameters, budget allocations</li>
                <li><strong>Platform Credentials:</strong> OAuth tokens and API credentials for third-party platforms (Google Ads, Meta, LinkedIn)</li>
                <li><strong>User Content:</strong> Any content, data, or files you upload or create using our services</li>
                <li><strong>Communication Data:</strong> Support requests, feedback, and correspondence with us</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Automatically Collected Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, actions taken, time spent on platform</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Performance Data:</strong> Campaign metrics, conversion data, analytics information</li>
                <li><strong>Log Data:</strong> Access times, error logs, system activity</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Third-Party Platform Data
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Marketing Platform Data:</strong> Campaign performance, audience insights, conversion data from connected advertising platforms</li>
                <li><strong>Analytics Data:</strong> Website and campaign performance metrics from integrated analytics services</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Primary Purposes
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Service Delivery:</strong> Provide, maintain, and improve our platform and AI-powered features</li>
                <li><strong>Campaign Management:</strong> Execute, optimize, and report on marketing campaigns</li>
                <li><strong>AI Processing:</strong> Train and operate AI models for campaign optimization and recommendations</li>
                <li><strong>Account Management:</strong> Create and manage your account, process payments, provide support</li>
                <li><strong>Communication:</strong> Send service updates, security alerts, and administrative messages</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                AI and Machine Learning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our AI systems process your campaign data to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Generate performance predictions and optimization recommendations</li>
                <li>Automate campaign adjustments and budget allocation</li>
                <li>Identify audience patterns and targeting opportunities</li>
                <li>Create performance reports and insights</li>
              </ul>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  <strong>Important:</strong> AI processing occurs within our secure infrastructure. 
                  We do not share your proprietary campaign strategies or performance data with 
                  third parties for AI training purposes.
                </p>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Information Sharing and Disclosure
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                We Share Information With:
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Service Providers:</strong> Cloud hosting, payment processing, analytics, customer support tools - only as necessary to provide services</li>
                <li><strong>Advertising Platforms:</strong> Google Ads, Meta, LinkedIn - only the data necessary to execute your campaigns through their APIs</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets, subject to confidentiality obligations</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request, or to protect rights and safety</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                We Do NOT:
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Sell your personal information or campaign data to third parties</li>
                <li>Share your proprietary marketing strategies with competitors</li>
                <li>Use your data to benefit competing clients</li>
                <li>Disclose client-specific performance data publicly</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Security Measures
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Encryption:</strong> Data encrypted in transit (TLS 1.3+) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based permissions, multi-factor authentication, principle of least privilege</li>
                <li><strong>Infrastructure:</strong> SOC 2 compliant cloud providers (Vercel, Render, Supabase)</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring, intrusion detection, automated threat response</li>
                <li><strong>Regular Audits:</strong> Security assessments, penetration testing, vulnerability scanning</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Rights and Choices
              </h2>
              
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Access and Control
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li><strong>Export:</strong> Download your data in machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                California Residents (CCPA)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                California residents have additional rights including the right to know what personal 
                information is collected, opt-out of sale (we do not sell data), and non-discrimination 
                for exercising privacy rights.
              </p>

              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                European Residents (GDPR)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                EU/EEA residents have additional rights including data portability, restricting processing, 
                objecting to processing, and lodging complaints with supervisory authorities.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Privacy Questions or Concerns
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> privacy@pulsebridge.ai
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Data Protection Officer
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  For GDPR-related inquiries: dpo@pulsebridge.ai
                </p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We may update this Privacy Policy periodically. We will notify you of material changes via 
                email notification to your registered email address, prominent notice on our platform, 
                or platform notification system.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Continued use after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Acceptance */}
            <section className="border-t border-gray-200 dark:border-gray-600 pt-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-blue-800 dark:text-blue-200 font-medium text-center">
                  <strong>By using PulseBridge.ai, you acknowledge that you have read and understood 
                  this Privacy Policy and agree to its terms.</strong>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}