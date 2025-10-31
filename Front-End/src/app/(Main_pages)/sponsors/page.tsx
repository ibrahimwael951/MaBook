"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake,
  Building2,
  Target,
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  Award,
  Sparkles,
  CheckCircle2,
  Mail,
  ChevronRight,
  Rocket,
  Star,
  BookOpen,
  MessageSquare,
  Video,
  Megaphone,
  Eye,
  MousePointerClick,
  Clock,
  Shield,
  Zap,
  Gift,
  Crown,
  Lightbulb,
} from "lucide-react";

import { Animate, FadeUp, FadeLeft, FadeRight } from "@/animation";
import Link from "next/link";

const platformStats = [
  {
    label: "Monthly Active Users",
    value: "50K+",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "Books Tracked",
    value: "2M+",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
  },
  {
    label: "Daily Engagement",
    value: "18 min",
    icon: Clock,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Monthly Growth",
    value: "150%",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
  },
];

const audienceDemographics = [
  { label: "Book Enthusiasts", percentage: "85%", icon: BookOpen },
  { label: "Age 18-45", percentage: "78%", icon: Users },
  { label: "College Educated", percentage: "92%", icon: Award },
  { label: "Regular Buyers", percentage: "65%", icon: Target },
];

const sponsorshipBenefits = [
  {
    icon: Award,
    title: "Dedicated Sponsors Page",
    description:
      "Your company logo and description featured on our official sponsors page, visible to all users",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Megaphone,
    title: "Brand Visibility",
    description:
      "Logo placement in strategic locations: homepage, newsletter, and high-traffic pages",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Social Media Mentions",
    description:
      "Regular shoutouts and featured posts across our social media channels",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Rocket,
    title: "Co-Branded Campaigns",
    description:
      "Collaborative marketing campaigns and exclusive partnership announcements",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Detailed monthly reports on impressions, clicks, and engagement metrics",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Video,
    title: "Content Partnership",
    description:
      "Featured blog posts, video content, and interviews with your team",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const sponsorshipPackages = [
  {
    name: "Bronze Partner",
    icon: Award,
    gradient: "from-amber-600 to-amber-800",
    bgGradient:
      "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    features: [
      "Logo on sponsors page",
      "Monthly newsletter mention",
      "Social media shoutout (2x/month)",
      "Link to your website",
      "Monthly analytics report",
    ],
    cta: "Starting at $500/month",
  },
  {
    name: "Silver Partner",
    icon: Star,
    gradient: "from-gray-400 to-gray-600",
    bgGradient:
      "from-gray-50 to-slate-50 dark:from-gray-800/20 dark:to-slate-800/20",
    popular: true,
    features: [
      "All Bronze benefits",
      "Featured logo placement (homepage)",
      "Dedicated blog post feature",
      "Social media campaign (4x/month)",
      "Priority support channel",
      "Quarterly performance review",
      "Co-branded email campaign",
    ],
    cta: "Starting at $1,500/month",
  },
  {
    name: "Gold Partner",
    icon: Crown,
    gradient: "from-yellow-400 to-yellow-600",
    bgGradient:
      "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
    features: [
      "All Silver benefits",
      "Premium homepage banner",
      "Exclusive partner badge",
      "Video interview/feature",
      "Custom landing page",
      "Weekly social mentions",
      "Joint webinar/event hosting",
      "API integration opportunities",
      "Dedicated account manager",
    ],
    cta: "Starting at $5,000/month",
  },
];

const successStories = [
  {
    company: "TechBooks Publishing",
    logo: "/sponsors/techbooks.png",
    quote:
      "Partnering with Ma Book increased our visibility by 300% among tech readers.",
    person: "Sarah Johnson",
    position: "Marketing Director",
    results: [
      { metric: "Impressions", value: "+2.5M" },
      { metric: "Click-through", value: "+12%" },
      { metric: "Conversions", value: "+45%" },
    ],
  },
  {
    company: "ReadWell Foundation",
    logo: "/sponsors/readwell.png",
    quote:
      "The collaboration helped us reach thousands of passionate readers who care about literacy.",
    person: "Michael Chen",
    position: "Executive Director",
    results: [
      { metric: "Awareness", value: "+400%" },
      { metric: "Donations", value: "+85%" },
      { metric: "Volunteers", value: "+120" },
    ],
  },
];

const whyPartner = [
  {
    icon: Target,
    title: "Highly Engaged Audience",
    description:
      "Our users spend an average of 18 minutes per session, actively discovering and tracking books.",
  },
  {
    icon: Eye,
    title: "Quality Over Quantity",
    description:
      "Reach passionate book lovers, educators, and lifelong learners with high purchasing power.",
  },
  {
    icon: Shield,
    title: "Brand-Safe Environment",
    description:
      "Ad-free, premium experience where your brand stands out without competing for attention.",
  },
  {
    icon: Zap,
    title: "Fast-Growing Platform",
    description:
      "Join a rapidly expanding community with 150% year-over-year growth.",
  },
];

export default function SponsorPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    package: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
  };

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondaryHigh to-purple-600 !text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...FadeLeft} {...Animate}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Building2 className="w-5 h-5" />
                <span className="font-semibold !text-white">
                  Corporate Partnerships
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Partner With{" "}
                <span className="!bg-gradient-to-r !from-yellow-200 !to-pink-200 !bg-clip-text !text-transparent">
                  50,000+ Readers
                </span>
              </h1>

              <p className="text-xl md:text-2xl !text-white/90 mb-8 leading-relaxed">
                Connect your brand with an engaged community of book lovers,
                educators, and lifelong learners through strategic sponsorship
                opportunities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#packages"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-secondary font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  View Packages
                  <ChevronRight className="w-5 h-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </motion.a>
              </div>
            </motion.div>

            <motion.div {...FadeRight} {...Animate} className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Platform Reach</h3>
                <div className="grid grid-cols-2 gap-6">
                  {platformStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                      >
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-3xl !text-white font-bold mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm !text-white/80">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audience Demographics */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Reach the Right Audience
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform attracts highly engaged readers with strong
              purchasing intent
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {audienceDemographics.map((demo, index) => (
              <motion.div
                key={demo.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondaryHigh rounded-full flex items-center justify-center mx-auto mb-4">
                  <demo.icon className="w-10 h-10 text-white" />
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {demo.percentage}
                </p>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {demo.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Partner With Ma Book?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Strategic advantages that set us apart from other platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyPartner.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondaryHigh rounded-2xl flex items-center justify-center mb-6">
                  <reason.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Benefits */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What You Get as a Sponsor
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive benefits designed to maximize your brand visibility
              and ROI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsorshipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4`}
                >
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      {/* <section id="packages" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...FadeUp}
            {...Animate}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Sponsorship Packages
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Flexible partnership options tailored to your marketing goals and budget
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorshipPackages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-gradient-to-br ${pkg.bgGradient} rounded-3xl p-8 border-2 ${
                  pkg.popular
                    ? "border-secondary shadow-2xl"
                    : "border-gray-200 dark:border-gray-700 shadow-lg"
                } hover:shadow-2xl transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-secondary to-secondaryHigh text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`w-20 h-20 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <pkg.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                  {pkg.name}
                </h3>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pkg.cta}
                  </p>
                </div>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  className={`block w-full py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center ${
                    pkg.popular
                      ? "bg-gradient-to-r from-secondary to-secondaryHigh text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  Get Started
                </motion.a>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.4 },
            }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need a custom package? We can create a tailored sponsorship plan for your specific needs.
            </p>
            <a href="#contact" className="text-secondary hover:text-secondaryHigh font-semibold inline-flex items-center gap-2">
              Contact us for custom solutions
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section> */}

      {/* Success Stories */}
      {/* <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...FadeUp}
            {...Animate}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how brands have grown through partnerships with Ma Book
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {story.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.position}
                    </p>
                  </div>
                </div>

                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-6">
                  "{story.quote}"
                </blockquote>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-full flex items-center justify-center text-white font-bold">
                    {story.person.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {story.person}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.position}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
                  {story.results.map((result) => (
                    <div key={result.metric} className="text-center">
                      <p className="text-2xl font-bold text-secondary mb-1">
                        {result.value}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {result.metric}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Form */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-12">
            <Handshake className="w-16 h-16 mx-auto mb-6 text-secondary dark:text-secondaryHigh" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Let's Partner Together
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Fill out the form below and our partnerships team will contact you
              within 24 hours
            </p>
          </motion.div>

          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.2 },
            }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="Your Company Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                  placeholder="https://www.yourcompany.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Interested Package
                </label>
                <select
                  value={formData.package}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all"
                >
                  <option value="">Select a package</option>
                  <option value="bronze">Bronze Partner</option>
                  <option value="silver">Silver Partner</option>
                  <option value="gold">Gold Partner</option>
                  <option value="custom">Custom Package</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tell us about your goals *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all resize-none"
                  placeholder="Tell us about your company, marketing goals, and what you hope to achieve through this partnership..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Send Partnership Inquiry
              </motion.button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                We typically respond within 24 hours during business days
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Current Sponsors Showcase */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Our Trusted Partners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join these amazing companies supporting the Ma Book community
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              {/* Placeholder for sponsor logos */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all flex items-center justify-center border border-gray-200 dark:border-gray-700 grayscale hover:grayscale-0"
                >
                  <Building2 className="w-12 h-12 text-gray-400" />
                </motion.div>
              ))}
            </div>

            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.5 },
              }}
              className="text-center mt-12"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Your Company Could Be Here
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-secondary dark:text-secondaryHigh hover:text-secondaryHigh font-semibold"
              >
                Become a sponsor today
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...FadeUp} {...Animate} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about sponsoring Ma Book
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How long is the minimum sponsorship period?",
                answer:
                  "We offer flexible terms starting from 3 months. Longer commitments (6-12 months) receive additional benefits and preferential rates.",
              },
              {
                question: "When will my logo appear on the platform?",
                answer:
                  "Your branding will be live within 48 hours of contract signing and payment confirmation. We'll provide you with a detailed timeline and placement preview.",
              },
              {
                question: "Can I see analytics of my sponsorship performance?",
                answer:
                  "Yes! All sponsors receive monthly detailed reports including impressions, clicks, engagement rates, and demographic insights of users who interacted with your brand.",
              },
              {
                question: "What makes Ma Book different from other platforms?",
                answer:
                  "Our audience is highly engaged with an average session time of 18 minutes. We're ad-free, so your sponsorship stands out without competing for attention. Plus, our community is passionate about books and learning.",
              },
              {
                question: "Can we create custom campaigns?",
                answer:
                  "Absolutely! We work closely with sponsors to create custom campaigns that align with your marketing objectives. This can include special events, giveaways, content series, and more.",
              },
              {
                question: "Is there a refund policy?",
                answer:
                  "We offer a 30-day satisfaction guarantee. If you're not satisfied with the partnership within the first month, we'll provide a prorated refund.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-secondary dark:text-secondaryHigh flex-shrink-0 mt-1" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-9">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondaryHigh to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...FadeUp} {...Animate}>
            <Rocket className="w-20 h-20 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Grow Your Brand?
            </h2>
            <p className="text-xl !text-white/90 mb-8 leading-relaxed">
              Join forward-thinking companies who are connecting with passionate
              readers and building meaningful brand relationships on Ma Book.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-secondary font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
              >
                <Mail className="w-5 h-5" />
                Start Partnership Discussion
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:partnerships@mabook.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5" />
                partnerships@mabook.com
              </motion.a>
            </div>
            <p className="mt-8 !text-white/80 text-sm">
              Questions? Contact us at{" "}
              <Link
                href="/contact"
                className="text-white border-b border-white pb-0.5 mx-0.5"
              >
                {" "}
                Contact Page{" "}
              </Link>{" "}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
