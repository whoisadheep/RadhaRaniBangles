"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-cream via-background to-champagne py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary animate-fade-in-up">
            Get in Touch
          </h1>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto animate-fade-in-up stagger-1">
            We&apos;d love to hear from you. Whether it&apos;s a custom order, a question,
            or just a hello — reach out anytime.
          </p>
          <nav className="mt-4 animate-fade-in-up stagger-2" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground">
              <li><Link href="/" className="hover:text-accent transition-colors cursor-pointer">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-primary font-medium">Contact</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 animate-fade-in-up">
              <h2 className="font-heading text-2xl font-semibold text-primary mb-6">
                Visit Our Store
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    title: "Address",
                    content: "42, Jewellers Lane, Zaveri Bazaar\nMumbai, Maharashtra 400003",
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    ),
                    title: "Phone",
                    content: "+91 98765 43210\n+91 22 2345 6789",
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    title: "Email",
                    content: "hello@radharanibangles.com\nsupport@radharanibangles.com",
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                    title: "Store Hours",
                    content: "Mon – Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM",
                  },
                ].map((info) => (
                  <div key={info.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary">
                        {info.title}
                      </h3>
                      <p className="font-body text-sm text-secondary mt-1 whitespace-pre-line">
                        {info.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-10 pt-8 border-t border-border">
                <p className="font-body text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "Pinterest"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-accent hover:bg-accent/5 text-secondary hover:text-accent transition-all duration-300 cursor-pointer"
                      aria-label={s}
                    >
                      <span className="font-body text-[10px] font-semibold">{s[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3 animate-fade-in-up stagger-1">
              <div className="glass-gold rounded-2xl p-5 sm:p-8 lg:p-10">
                <h2 className="font-heading text-2xl font-semibold text-primary mb-2">
                  Send Us a Message
                </h2>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="text-center py-12 animate-scale-in">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl text-primary">Thank You!</h3>
                    <p className="font-body text-sm text-muted-foreground mt-2">
                      Your message has been sent. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="firstName" className="block font-body text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          required
                          className="w-full bg-white/80 border border-border rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-accent transition-colors"
                          placeholder="Priya"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block font-body text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          required
                          className="w-full bg-white/80 border border-border rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-accent transition-colors"
                          placeholder="Sharma"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-body text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        className="w-full bg-white/80 border border-border rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-accent transition-colors"
                        placeholder="priya@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block font-body text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        className="w-full bg-white/80 border border-border rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-accent transition-colors cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Custom Order</option>
                        <option>Shipping & Returns</option>
                        <option>Bulk/Wholesale</option>
                        <option>Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block font-body text-xs uppercase tracking-[0.15em] font-semibold text-primary mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        className="w-full bg-white/80 border border-border rounded-lg px-4 py-3 font-body text-sm outline-none focus:border-accent transition-colors resize-none"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent-dark text-on-accent font-body text-sm uppercase tracking-widest py-4 rounded-full transition-all duration-300 cursor-pointer hover:shadow-[0_8px_30px_rgba(161,98,7,0.25)]"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
