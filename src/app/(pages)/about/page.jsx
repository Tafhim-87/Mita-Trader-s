"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, 
  Users, 
  Target, 
  Heart, 
  Star, 
  Award, 
  Globe, 
  Shield, 
  Truck, 
  Headphones,
  Sparkles,
  BookText,
  GraduationCap,
  Lightbulb,
  Trophy,
  Coffee,
  TrendingUp
} from "lucide-react";

export default function AboutUsPage() {
  const aboutText = `বাংলাদেশের সর্বপ্রথম ও সর্ববৃহৎ ডিজিটাল বইবাজার হিসেবে আমাদের যাত্রা শুরু হয় ২০১৮ সালে। একটি স্বপ্ন থেকে - স্বপ্ন ছিল এমন একটি প্ল্যাটফর্ম তৈরি করার যেখানে প্রতিটি বইপ্রেমী সহজেই তাদের প্রিয় বই খুঁজে পাবে, পড়বে এবং জ্ঞানের আলো ছড়িয়ে দেবে। 

আমরা বিশ্বাস করি বই মানুষের জীবন বদলে দিতে পারে। একটি ভালো বই একজনের চিন্তাধারা, দৃষ্টিভঙ্গি এবং জীবনকে সম্পূর্ণ রূপে পরিবর্তন করতে পারে। আমাদের লক্ষ্য সারা বাংলাদেশে জ্ঞানের আলো ছড়িয়ে দেয়া এবং প্রতিটি মানুষের হাতে প্রিয় বই পৌঁছে দেয়া। 

শুরুতে আমাদের সংগ্রহে ছিল মাত্র ৫০০ বই এবং একটি ছোট্ট টিম। আজ আমাদের সংগ্রহে আছে ৫০,০০০+ বই, ১০০+ প্রকাশনা সংস্থার সাথে পার্টনারশিপ এবং দেশব্যাপী ৫,০০,০০০+ সন্তুষ্ট গ্রাহক। আমাদের এই যাত্রায় সাথী হয়েছেন দেশের সেরা লেখক, প্রকাশক এবং বিপুল সংখ্যক বইপ্রেমী পাঠক।

আমাদের মিশন হচ্ছে ডিজিটাল বাংলাদেশের প্রতিটি মানুষকে বই পড়ার অভ্যাস গড়ে তোলায় সাহায্য করা। আমরা চাই প্রতিটি ঘরে একটি করে বইয়ের আলমারি হোক, প্রতিটি হাতে একটি করে বই থাকুক।`;

  const stats = [
    { icon: BookOpen, value: "৫০,০০০+", label: "বইয়ের সংগ্রহ" },
    { icon: Users, value: "৫,০০,০০০+", label: "সন্তুষ্ট গ্রাহক" },
    { icon: Trophy, value: "৬,০০,০০০+", label: "বিক্রিত বই" },
    { icon: Globe, value: "৬৪", label: "জেলায় সেবা" },
  ];

  const values = [
    {
      icon: Heart,
      title: "জ্ঞানের প্রতি ভালোবাসা",
      description: "প্রতিটি বই হচ্ছে জ্ঞানের ভাণ্ডার। আমাদের দায়িত্ব সেই ভাণ্ডারকে সবার কাছে পৌঁছে দেয়া। আমরা বিশ্বাস করি জ্ঞানই একমাত্র সম্পদ যা বিতরণ করলে কমে না, বরং বাড়ে।"
    },
    {
      icon: Shield,
      title: "নির্ভরযোগ্যতা",
      description: "আমরা প্রতিশ্রুতি দিই শুধুমাত্র অরিজিনাল বই সরবরাহের। কোন প্রকার নকল বা পাইরেটেড বই আমাদের সংগ্রহে নেই। প্রতিটি বইয়ের গুণগত মান নিশ্চিত করাই আমাদের প্রধান লক্ষ্য।"
    },
    {
      icon: Headphones,
      title: "গ্রাহক সেবা",
      description: "আমরা শুধু বই বিক্রি করি না, বই পড়ার অভ্যাস গড়ে তোলায় সাহায্য করি। ২৪/৭ কাস্টমার সার্ভিস, বই নির্বাচনে সহায়তা মাধ্যমে আমরা সম্পূর্ণ বইপাঠক কমিউনিটি তৈরি করছি।"
    },
    {
      icon: Target,
      title: "সামাজিক দায়বদ্ধতা",
      description: "প্রতি ১০টি বই বিক্রি হলে আমরা একটি বই দান করি দেশের বিভিন্ন শিক্ষা প্রতিষ্ঠানে। এ পর্যন্ত আমরা ৫০,০০০+ বই দান করেছি গ্রামীণ স্কুল, কলেজ এবং লাইব্রেরিতে।"
    }
  ];

  const team = [
    { name: "আরিফুল ইসলাম", role: "প্রতিষ্ঠাতা ও সিইও", experience: "১০+ বছর" },
    { name: "সাবেরা খাতুন", role: "হেড অফ অপারেশন্স", experience: "৮+ বছর" },
    { name: "রাজীব আহমেদ", role: "প্রযুক্তি পরিচালক", experience: "১২+ বছর" },
    { name: "তাসনিমা আক্তার", role: "গ্রাহক সেবা প্রধান", experience: "৬+ বছর" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-medium">২০১৮ সাল থেকে বইয়ের বিশ্বস্ত সঙ্গী</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              আমাদের সম্পর্কে
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              বাংলাদেশের সর্ববৃহৎ ডিজিটাল বইবাজারে আপনাকে স্বাগতম
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Intro Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <BookText className="w-12 h-12 text-blue-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-900">আমাদের গল্প</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <div className="whitespace-pre-line font-bangla text-lg leading-8 tracking-wide">
                  {aboutText}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mission Vision Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">আমাদের মিশন</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                ডিজিটাল বাংলাদেশের প্রতিটি মানুষকে বই পড়ার অভ্যাস গড়ে তোলায় সাহায্য করা। 
                আমরা চাই প্রতিটি ঘরে একটি করে বইয়ের আলমারি হোক, প্রতিটি হাতে একটি করে বই থাকুক। 
                জ্ঞানের আলো ছড়িয়ে দিয়ে একটি শিক্ষিত ও উন্নত জাতি গঠনে অবদান রাখাই আমাদের লক্ষ্য।
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            >
              <div className="flex items-center mb-6">
                <Lightbulb className="w-10 h-10 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">আমাদের ভিশন</h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                ২০৩০ সালের মধ্যে বাংলাদেশের বৃহত্তম ডিজিটাল লাইব্রেরি ও বইয়ের কমিউনিটি তৈরি করা। 
                আমরা চাই বাংলাদেশের প্রতিটি মানুষ বই পড়ার সুযোগ পাক। দেশের প্রতিটি শিক্ষার্থী, 
                পেশাজীবী এবং সাধারণ মানুষের হাতে প্রয়োজনীয় বই পৌঁছে দিয়ে জ্ঞানভিত্তিক সমাজ গঠনে ভূমিকা রাখা।
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">আমাদের মূল্যবোধ</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                যা আমাদেরকে আলাদা করে এবং আমাদের প্রতিটি সিদ্ধান্তকে পরিচালিত করে
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">আমাদের নেতৃত্ব টিম</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                অভিজ্ঞতা এবং আবেগের সমন্বয়ে গঠিত আমাদের দক্ষ টিম
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">অভিজ্ঞতা: {member.experience}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center mb-8">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">আমাদের সেবাসমূহ</h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  যা আমরা অফার করি গ্রাহকদের জন্য
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <Truck className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="text-lg font-bold mb-2">দ্রুত ডেলিভারি</h4>
                  <p className="text-blue-100">২৪-৭২ ঘন্টার মধ্যে বই হাতে</p>
                </div>
                <div className="text-center p-4">
                  <Shield className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="text-lg font-bold mb-2">নিরাপদ পেমেন্ট</h4>
                  <p className="text-blue-100">SSL সিকিউরড লেনদেন</p>
                </div>
                <div className="text-center p-4">
                  <Headphones className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="text-lg font-bold mb-2">২৪/৭ সাপোর্ট</h4>
                  <p className="text-blue-100">সবসময় আপনার পাশে</p>
                </div>
                <div className="text-center p-4">
                  <TrendingUp className="w-10 h-10 mx-auto mb-3" />
                  <h4 className="text-lg font-bold mb-2">বিশেষ অফার</h4>
                  <p className="text-blue-100">নিয়মিত ডিসকাউন্ট ও অফার</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Future Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <Coffee className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ভবিষ্যৎ পরিকল্পনা</h2>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">২০২৪-২০২৫</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>ডিজিটাল লাইব্রেরি লঞ্চ</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>মোবাইল অ্যাপ রিলিজ</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>১০০+ নতুন প্রকাশক যুক্তকরণ</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">২০২৬-২০৩০</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>আন্তর্জাতিক সম্প্রসারণ</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>১ মিলিয়ন+ ই-বুক কালেকশন</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-purple-500 mr-2 mt-1" />
                      <span>বাংলাদেশের প্রতিটি স্কুলে বই দান</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              "বই পড়ুন, জ্ঞান অর্জন করুন, সমৃদ্ধ হোন"
            </h3>
            <p className="text-gray-700 text-lg mb-6">
              এই মূলমন্ত্র নিয়ে আমরা কাজ করে যাচ্ছি। আপনার সমর্থন আমাদের শক্তি, 
              আপনার পরামর্শ আমাদের পথনির্দেশ। চলুন, সবাই মিলে বই পড়ার সংস্কৃতি ছড়িয়ে দেই।
            </p>
            <div className="text-xl font-bold text-blue-600">
              বইবাজার - বইয়ের বিশ্বস্ত সঙ্গী
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Bangla font support */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
        .font-bangla {
          font-family: 'Hind Siliguri', sans-serif;
        }
        .prose {
          color: #374151;
        }
        .prose p {
          margin-bottom: 1.5em;
          line-height: 1.8;
        }
        .prose h2 {
          color: #1f2937;
          font-size: 1.875rem;
          font-weight: bold;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        .prose h3 {
          color: #374151;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
        }
      `}</style>
    </div>
  );
}