"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, you would send this to your API
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-12 rounded-2xl bg-gradient-to-r from-accent to-accent/80 px-6 py-10 text-white"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-3 text-white/90">
          Stay updated with the latest products, exclusive offers, and style tips.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full flex-1 rounded-full bg-white/10 px-5 py-3 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-white px-6 py-3 font-medium text-accent transition-colors hover:bg-white/90 sm:w-auto"
            >
              Subscribe
            </button>
          </div>
        </form>

        {isSubmitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-white"
          >
            Thank you for subscribing!
          </motion.p>
        )}

        <p className="mt-4 text-sm text-white/70">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </motion.section>
  );
}