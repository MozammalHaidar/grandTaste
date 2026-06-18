import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import SEO from "../components/SEO";

const team = [
  {
    name: "Rahim Uddin",
    role: "Head Chef",
    emoji: "👨‍🍳",
    desc: "10+ years of culinary excellence",
  },
  {
    name: "Priya Das",
    role: "Restaurant Manager",
    emoji: "👩‍💼",
    desc: "Ensuring perfect customer experience",
  },
  {
    name: "Karim Sheikh",
    role: "Delivery Head",
    emoji: "🚴",
    desc: "Fast & safe delivery guaranteed",
  },
  {
    name: "Nadia Islam",
    role: "Quality Control",
    emoji: "👩‍🔬",
    desc: "Fresh ingredients every single day",
  },
];

const values = [
  {
    icon: "🌿",
    title: "Fresh Ingredients",
    desc: "We source only the freshest locally grown ingredients every morning to ensure maximum flavor and nutrition.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "Our optimized delivery network ensures your food arrives hot and fresh within 30 minutes guaranteed.",
  },
  {
    icon: "❤️",
    title: "Made with Love",
    desc: "Every dish is prepared with passion and care by our experienced chefs who love what they do.",
  },
  {
    icon: "🏆",
    title: "Quality First",
    desc: "We never compromise on quality. Every order goes through strict quality checks before leaving our kitchen.",
  },
  {
    icon: "💰",
    title: "Affordable Prices",
    desc: "Great food shouldn't break the bank. We offer the best value for money without sacrificing taste.",
  },
  {
    icon: "🌍",
    title: "Community Focus",
    desc: "We are proud to serve our local community and give back through charitable initiatives every month.",
  },
];

const milestones = [
  {
    year: "2020",
    title: "Founded",
    desc: "Started with a small kitchen and big dreams in Dhaka.",
  },
  {
    year: "2021",
    title: "1000+ Orders",
    desc: "Reached our first major milestone with happy customers.",
  },
  {
    year: "2022",
    title: "Expanded Menu",
    desc: "Added 30+ new items including pizza, tacos and more.",
  },
  {
    year: "2023",
    title: "Best Restaurant Award",
    desc: "Won the Best Fast Food Restaurant award in Dhaka.",
  },
  {
    year: "2024",
    title: "Online Platform",
    desc: "Launched our full online ordering and delivery platform.",
  },
  {
    year: "2025",
    title: "500+ Customers",
    desc: "Now serving 500+ happy customers every single day.",
  },
];

const AboutPage = () => {
  return (
    <Layout>
      <SEO
        title="About Us"
        description="Learn about GrandTaste — our story, values, and the team behind your favorite food."
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 py-20 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="container-custom text-center text-white relative z-10">
          <div className="text-6xl mb-4">🍔</div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Story
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
            From a small kitchen with big dreams to serving 500+ happy customers
            daily — this is the story of GrandTaste.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <p className="text-primary-500 font-medium mb-2">Who We Are</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">
                We're More Than Just a Fast Food Restaurant
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                GrandTaste was founded in 2020 with one simple mission — to
                bring hot, fresh, and delicious food to your doorstep as fast as
                possible. We believe that great food should be accessible to
                everyone, at any time.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our team of passionate chefs, dedicated delivery riders, and
                friendly customer service staff work together every day to make
                your dining experience truly exceptional. We use only the
                freshest ingredients, sourced locally every morning.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary-50 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-primary-500">500+</p>
                  <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
                </div>
                <div className="bg-primary-50 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-primary-500">50+</p>
                  <p className="text-sm text-gray-500 mt-1">Menu Items</p>
                </div>
                <div className="bg-primary-50 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-primary-500">4.9★</p>
                  <p className="text-sm text-gray-500 mt-1">Average Rating</p>
                </div>
              </div>
            </div>
            {/* Right */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-orange-100 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden">
                <div className="text-[120px] select-none">🍔</div>
                <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-lg px-4 py-3">
                  <p className="text-xs text-gray-400">Est.</p>
                  <p className="text-2xl font-bold text-primary-500">2020</p>
                </div>
                <div className="absolute top-4 left-4 bg-white rounded-2xl shadow-lg px-4 py-3">
                  <p className="text-xs text-gray-400">Delivery</p>
                  <p className="text-lg font-bold text-gray-800">⚡ 30 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">What Drives Us</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {val.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">Our Journey</p>
            <h2 className="text-3xl font-bold text-gray-900">
              How We Got Here
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-primary-100 hidden md:block" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {milestones.map((item, i) => (
                <div
                  key={item.year}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Dot */}
                  <div className="w-16 h-16 bg-primary-500 group-hover:bg-primary-600 rounded-2xl flex flex-col items-center justify-center text-white z-10 shadow-md transition-colors mb-4 flex-shrink-0">
                    <p className="text-xs font-bold opacity-80">{item.year}</p>
                  </div>
                  {/* Content */}
                  <div className="bg-primary-50 group-hover:bg-primary-100 rounded-2xl p-4 transition-colors w-full">
                    <p className="font-bold text-gray-800 text-sm mb-1">
                      {item.title}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">
              The People Behind
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.emoji}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-primary-500 text-sm font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-400 text-xs">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container-custom text-center text-white">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience GrandTaste? 🍔
          </h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            Join our growing family of happy customers and taste the difference
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-white text-primary-600 hover:bg-orange-50 font-bold py-4 px-10 rounded-xl transition-all text-lg shadow-lg"
            >
              Order Now 🍔
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-xl transition-all text-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
