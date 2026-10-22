import { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2, MessageSquare, Navigation } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: ['123 Fitness Avenue', 'Westlands, Nairobi', 'Kenya, 00100'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+254 712 345 678', '+254 780 123 456'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['info@ironcoregym.com', 'support@ironcoregym.com'],
    },
  ];

  const hours = [
    { day: 'Monday - Friday', time: '5:00 AM - 11:00 PM' },
    { day: 'Saturday', time: '6:00 AM - 9:00 PM' },
    { day: 'Sunday', time: '8:00 AM - 6:00 PM' },
    { day: 'Public Holidays', time: '9:00 AM - 2:00 PM' },
  ];

  return (
    <div className="pt-16">
      <section className="py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-400 font-medium">Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-balance">
            We'd Love to <span className="text-primary-500">Hear From You</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Have questions about membership, training programs, or supplements? Reach out and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
            {submitted && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-400">Message sent! We'll get back to you within 24 hours.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{info.title}</h4>
                  {info.lines.map((line) => (
                    <p key={line} className="text-sm text-neutral-400">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Hours */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-500" />
                </div>
                <h4 className="font-semibold">Opening Hours</h4>
              </div>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-neutral-400">{h.day}</span>
                    <span className="text-white font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary-500" />
                </div>
                <h4 className="font-semibold">Find Us</h4>
              </div>
              <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                <img
                  src="https://images.pexels.com/photos/6739958/pexels-photo-6739958.jpeg?auto=compress&cs=tinysrgb&h=400&w=600"
                  alt="Gym facility"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-white font-medium">IronCore Gym</p>
                    <p className="text-xs text-neutral-400">Westlands, Nairobi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gym info section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Our Facility', desc: '15,000 square feet of premium training space with cardio zones, free weights, functional training areas, group studios, recovery rooms, and a supplement bar.', img: 'https://images.pexels.com/photos/40371847/pexels-photo-40371847.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
            { title: 'Our Trainers', desc: 'Our team of 30+ certified personal trainers hold credentials from NASM, ACE, and ISSA. They specialize in strength, conditioning, rehab, and nutrition.', img: 'https://images.pexels.com/photos/39219660/pexels-photo-39219660.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
            { title: 'Our Community', desc: 'With over 2,500 active members, IronCore is more than a gym — it\'s a community. Join group challenges, social events, and fitness workshops.', img: 'https://images.pexels.com/photos/40104884/pexels-photo-40104884.jpeg?auto=compress&cs=tinysrgb&h=400&w=600' },
          ].map((item) => (
            <div key={item.title} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
