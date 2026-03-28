require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const config = require('./config/config');

const events = [
  // JANUARY
  {
    title: 'Sunburn Festival Goa',
    description: "Asia's biggest electronic dance music festival returns to Goa with world-class DJs and stunning beach vibes.",
    category: 'concert',
    date: new Date('2026-01-10'),
    time: '6:00 PM',
    venue: 'Vagator Beach, Goa',
    totalSeats: 30000,
    availableSeats: 30000,
    price: 2999,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Startup India Summit',
    description: "India's premier startup conference bringing together founders, investors and mentors from across the ecosystem.",
    category: 'conference',
    date: new Date('2026-01-24'),
    time: '9:00 AM',
    venue: 'Bharat Mandapam, Delhi',
    totalSeats: 5000,
    availableSeats: 5000,
    price: 1499,
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=95&fit=crop',
    isActive: true
  },
  // FEBRUARY
  {
    title: 'Arijit Singh Live Concert',
    description: "An unforgettable evening with Bollywood's most beloved voice performing his greatest hits live.",
    category: 'concert',
    date: new Date('2026-02-14'),
    time: '7:00 PM',
    venue: 'DY Patil Stadium, Mumbai',
    totalSeats: 50000,
    availableSeats: 50000,
    price: 1500,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Valentine Comedy Night',
    description: "Spend Valentine's evening laughing with India's top stand-up comedians including Zakir Khan and Kenny Sebastian.",
    category: 'concert',
    date: new Date('2026-02-14'),
    time: '8:00 PM',
    venue: 'Jio World Centre, Mumbai',
    totalSeats: 1200,
    availableSeats: 1200,
    price: 799,
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1920&q=95&fit=crop',
    isActive: true
  },
  // MARCH
  {
    title: 'Holi Music Festival',
    description: "Celebrate the festival of colours with live performances from top Bollywood and EDM artists.",
    category: 'concert',
    date: new Date('2026-03-14'),
    time: '11:00 AM',
    venue: 'Kingdom of Dreams, Gurgaon',
    totalSeats: 8000,
    availableSeats: 8000,
    price: 1299,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'React India Conference',
    description: "India's biggest React and frontend development conference with speakers from Google, Meta and top startups.",
    category: 'conference',
    date: new Date('2026-03-22'),
    time: '10:00 AM',
    venue: 'NIMHANS Convention Centre, Bangalore',
    totalSeats: 2000,
    availableSeats: 2000,
    price: 999,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=95&fit=crop',
    isActive: true
  },
  // APRIL
  {
    title: 'UI/UX Design Bootcamp',
    description: "Intensive 1-day bootcamp covering Figma, design systems, user research and portfolio building for designers.",
    category: 'workshop',
    date: new Date('2026-04-05'),
    time: '10:00 AM',
    venue: 'Amanora Mall, Pune',
    totalSeats: 80,
    availableSeats: 15,
    price: 799,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'IPL Watch Party — MI vs RCB',
    description: "Watch the biggest IPL rivalry live on giant screens with food, drinks and cricket fans from across the city.",
    category: 'concert',
    date: new Date('2026-04-19'),
    time: '7:30 PM',
    venue: 'Hard Rock Cafe, Bangalore',
    totalSeats: 400,
    availableSeats: 400,
    price: 599,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&q=95&fit=crop',
    isActive: true
  },
  // MAY
  {
    title: 'Photography Masterclass',
    description: "Learn professional photography from award-winning photographers. Covers composition, lighting and editing.",
    category: 'workshop',
    date: new Date('2026-05-10'),
    time: '3:00 PM',
    venue: 'Lodhi Garden, Delhi',
    totalSeats: 50,
    availableSeats: 5,
    price: 499,
    image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Google I/O Extended Bangalore',
    description: "Official Google I/O Extended event with live keynote viewing and local tech talks on AI, Flutter and Firebase.",
    category: 'conference',
    date: new Date('2026-05-22'),
    time: '9:30 AM',
    venue: 'Google Office, Bangalore',
    totalSeats: 500,
    availableSeats: 500,
    price: 0,
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1920&q=95&fit=crop',
    isActive: true
  },
  // JUNE
  {
    title: 'Nucleya Bass Camp',
    description: "India's biggest electronic music producer Nucleya hosts an all-night bass music experience on Goa's beach.",
    category: 'concert',
    date: new Date('2026-06-07'),
    time: '9:00 PM',
    venue: 'Anjuna Beach, Goa',
    totalSeats: 10000,
    availableSeats: 10000,
    price: 899,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Python for Data Science Workshop',
    description: "Hands-on full day workshop covering Pandas, NumPy, data visualization and building your first ML model.",
    category: 'workshop',
    date: new Date('2026-06-21'),
    time: '10:00 AM',
    venue: 'IIT Hyderabad Campus',
    totalSeats: 120,
    availableSeats: 120,
    price: 999,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1920&q=95&fit=crop',
    isActive: true
  },
  // JULY
  {
    title: 'AWS Summit India 2026',
    description: "Join thousands of cloud professionals for AWS announcements, technical sessions and hands-on labs.",
    category: 'conference',
    date: new Date('2026-07-10'),
    time: '9:00 AM',
    venue: 'HICC, Hyderabad',
    totalSeats: 5000,
    availableSeats: 5000,
    price: 1200,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Monsoon Music Night',
    description: "An intimate acoustic evening featuring indie artists performing original compositions in a rooftop setting.",
    category: 'concert',
    date: new Date('2026-07-26'),
    time: '7:00 PM',
    venue: 'Bonobo Rooftop, Mumbai',
    totalSeats: 300,
    availableSeats: 300,
    price: 699,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=95&fit=crop',
    isActive: true
  },
  // AUGUST
  {
    title: 'Independence Day Tech Meetup',
    description: "Celebrate 78 years of independence with talks on how Indian tech is shaping the global landscape.",
    category: 'conference',
    date: new Date('2026-08-15'),
    time: '11:00 AM',
    venue: 'India Habitat Centre, Delhi',
    totalSeats: 800,
    availableSeats: 800,
    price: 0,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Filmmaking Masterclass',
    description: "Learn cinematography, direction and post-production from industry professionals working in Bollywood.",
    category: 'workshop',
    date: new Date('2026-08-23'),
    time: '10:00 AM',
    venue: 'Film City, Mumbai',
    totalSeats: 60,
    availableSeats: 60,
    price: 1299,
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=95&fit=crop',
    isActive: true
  },
  // SEPTEMBER
  {
    title: 'Diljit Dosanjh Dil-Luminati Tour',
    description: "Punjabi pop sensation Diljit Dosanjh brings his record-breaking world tour to the capital.",
    category: 'concert',
    date: new Date('2026-09-06'),
    time: '7:30 PM',
    venue: 'JLN Stadium, Delhi',
    totalSeats: 75000,
    availableSeats: 75000,
    price: 2000,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Product Management Summit',
    description: "Two days of talks, workshops and networking for product managers from India's top tech companies.",
    category: 'conference',
    date: new Date('2026-09-19'),
    time: '9:00 AM',
    venue: 'Taj Yeshwantpur, Bangalore',
    totalSeats: 600,
    availableSeats: 600,
    price: 2499,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=95&fit=crop',
    isActive: true
  },
  // OCTOBER
  {
    title: 'Coldplay Music of the Spheres Tour',
    description: "The most anticipated concert of the decade. Coldplay returns to India with their spectacular world tour.",
    category: 'concert',
    date: new Date('2026-10-18'),
    time: '8:00 PM',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    totalSeats: 100000,
    availableSeats: 0,
    price: 4500,
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Diwali Design Sprint',
    description: "A festive 1-day design sprint where teams build creative digital products inspired by Indian culture.",
    category: 'workshop',
    date: new Date('2026-10-29'),
    time: '10:00 AM',
    venue: 'WeWork Koramangala, Bangalore',
    totalSeats: 100,
    availableSeats: 100,
    price: 599,
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1920&q=95&fit=crop',
    isActive: true
  },
  // NOVEMBER
  {
    title: 'DevFest India 2026',
    description: "Google Developer Groups India's annual festival with talks on AI, Flutter, Firebase and Cloud.",
    category: 'conference',
    date: new Date('2026-11-08'),
    time: '9:00 AM',
    venue: 'Chennai Trade Centre',
    totalSeats: 3000,
    availableSeats: 3000,
    price: 0,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'A R Rahman Symphony Concert',
    description: "Oscar winning composer A R Rahman performs his greatest compositions live with a 60-piece orchestra.",
    category: 'concert',
    date: new Date('2026-11-22'),
    time: '7:00 PM',
    venue: 'Jawaharlal Nehru Stadium, Chennai',
    totalSeats: 40000,
    availableSeats: 40000,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&q=95&fit=crop',
    isActive: true
  },
  // DECEMBER
  {
    title: 'New Year Eve Bash 2027',
    description: "Ring in 2027 with the biggest New Year party in India featuring live DJs, fireworks and unlimited fun.",
    category: 'concert',
    date: new Date('2026-12-31'),
    time: '9:00 PM',
    venue: 'Jawaharlal Nehru Stadium, Delhi',
    totalSeats: 20000,
    availableSeats: 20000,
    price: 3999,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920&q=95&fit=crop',
    isActive: true
  },
  {
    title: 'Year End Tech Recap Meetup',
    description: "Join the developer community for an evening reviewing the biggest tech moments of 2025 and what's coming in 2026.",
    category: 'conference',
    date: new Date('2026-12-20'),
    time: '6:00 PM',
    venue: 'Microsoft Office, Hyderabad',
    totalSeats: 400,
    availableSeats: 400,
    price: 0,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=95&fit=crop',
    isActive: true
  }
];

async function seed() {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const existingCount = await Event.countDocuments();
    if (existingCount > 0) {
      console.log('✅ DB already has data, skipping seed.');
      process.exit(0);
    }

    await Event.insertMany(events);
    console.log('✅ 12 events seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

seed();
