import { useState } from "react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

const contactInfo = [
  {
    icon: "📍",
    title: "Our Location",
    lines: ["123 Food Street, Motijheel", "Dhaka - 1000, Bangladesh"],
    bg: "bg-orange-50",
  },
  {
    icon: "📞",
    title: "Phone Number",
    lines: ["+880 1700-000000", "+880 1800-000000"],
    bg: "bg-blue-50",
  },
  {
    icon: "📧",
    title: "Email Address",
    lines: ["hello@GrandTaste.com", "support@GrandTaste.com"],
    bg: "bg-green-50",
  },
  {
    icon: "🕐",
    title: "Opening Hours",
    lines: ["Mon – Fri: 10AM – 11PM", "Sat – Sun: 9AM – 12AM"],
    bg: "bg-purple-50",
  },
];

const faqs = [
  {
    q: "How long does delivery take?",
    a: "We deliver within 30 minutes on average. Delivery time may vary depending on your location and order volume.",
  },
  {
    q: "What is the minimum order amount?",
    a: "There is no minimum order amount. However, orders above ৳500 get free delivery!",
  },
  {
    q: "Do you offer vegetarian options?",
    a: "Yes! We have a wide variety of vegetarian options clearly marked on our menu.",
  },
  {
    q: "How can I track my order?",
    a: "After placing your order, you can track its status in real-time from your Orders page.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel your order within 5 minutes of placing it. After that, contact our support team.",
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you within 24 hours. 🎉");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <Layout>
      <SEO
        title="Contact Us"
        description="Get in touch with GrandTaste. We're here to help 24/7!"
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-20 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="container-custom text-center text-white relative z-10">
          <div className="text-6xl mb-4">📬</div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? We'd love to
            hear from you!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className={`${info.bg} rounded-2xl p-6 text-center`}
              >
                <div className="text-4xl mb-3">{info.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-gray-500 text-sm">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="py-12 bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div>
              <p className="text-primary-500 font-medium mb-2">Find Us</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Our Location
              </h2>
              <div className="rounded-3xl overflow-hidden shadow-md h-64 lg:h-96 border border-gray-100">
                <iframe
                  title="GrandTaste Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2761930650766!2d90.40860807536232!3d23.737161778672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8eef3c0c017%3A0x2a9e5b5c5c5c5c5c!2sMotijheel%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Quick Info below map */}
              <div className="mt-5 bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Quick Contact</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+8801700000000"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <span className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">
                      📞
                    </span>
                    <span className="text-sm font-medium">
                      +880 1700-000000
                    </span>
                  </a>
                  <a
                    href="mailto:hello@GrandTaste.com"
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <span className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">
                      📧
                    </span>
                    <span className="text-sm font-medium">
                      hello@GrandTaste.com
                    </span>
                  </a>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-lg">
                      📍
                    </span>
                    <span className="text-sm font-medium">
                      123 Food Street, Dhaka, Bangladesh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <p className="text-primary-500 font-medium mb-2">Send Message</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                We'd Love to Hear From You
              </h2>
              <div className="bg-white rounded-3xl shadow-sm p-6 lg:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+880 1700-000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Issue</option>
                      <option value="delivery">Delivery Problem</option>
                      <option value="payment">Payment Issue</option>
                      <option value="feedback">General Feedback</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message 📬"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">
              Common Questions
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`text-primary-500 text-xl flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-500 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
