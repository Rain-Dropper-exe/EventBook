# EventBook 🎟️

Hi there! Welcome to **EventBook**, a full-stack MERN application I built to learn and demonstrate my skills in web development, backend architecture, and application design. 

I built this project to understand how real-world applications handle data, authentication, and user roles. While it's a practice project, I tried to handle edge cases and think about system design constraints as much as possible!

---

## 🌟 What Can You Do Here?

- **Browse Events:** Built a responsive UI where users can search for upcoming events (Concerts, Conferences, Workshops), filter by categories, and view them in a list or grid or even search by dates using the calendar.
- **Admin Dashboard:** Admins have a dedicated view where they can create, update, and manage events. They can also use an admin calendar to track schedules easily.
- **Bookings & Orders:** Users can select seats and place booking requests. The app checks real-time availability before they hit "pay" to make sure the event isn't sold out!
- **Email Notifications:** Once an admin approves a booking, the user gets an automated email. Also, if a new event goes live that matches a category you've booked before, you'll get a suggestion email!

---

## 🛠️ Tech Stack I Used

- **Frontend:** React, React Router, and plain CSS for styling.
- **Backend:** Node.js following the MVC (Model-View-Controller) pattern.
- **Database:** MongoDB hosted on MongoCloud (Atlas).
- **Authentication:** Google OAuth 2.0 along with JWT (JSON Web Tokens) to securely keep users logged in.
- **Hosting:** Vercel for both the React frontend and the Express backend (Serverless).

---

## 🤔 My Design Choices & Trade-offs

Since I am a fresher building this alone, I had to make some practical decisions about what to include and how to build it:

1. **Why only Admins can create events?** initially, I thought about letting any user create an event. However, I realized that without a proper vetting process, that could lead to spam and messy data. So, I restricted event creation strictly to the Admin role to keep the platform clean.
2. **Manual Booking Approvals:** I decided to have admins manually approve ticket requests rather than auto-accepting them. In a real highly-trafficked app, auto-accepting without advanced database-locking can lead to accidentally selling more tickets than you have. This manual queue was my way of safely handling ticket limits for now!
3. **Payments:** I wrote the initial integration for Stripe, but because full business verification takes a lot of time and live details, I currently bypassed the active payment gateway for this build.
4. **MVC Pattern:** I made sure to structure the backend strictly using controllers, routes, and models so the code is easy to read, debug, and scale.

---

## 🚀 Where I Want to Take This Next (Future System Design)

This project taught me a lot, but I already know what I need to learn next to make it even better! If I were to upgrade this to handle production "peak load" traffic, I would:

- **Implement Queues:** Use something like Redis or RabbitMQ to manage huge spikes in traffic when a popular concert ticket drops.
- **Better Race Conditions:** Build optimistic UI updates and strict database locks so multiple users trying to buy the exact same final ticket don't break the count.
- **Role Permissions:** Add an "Organizer" role so people can submit events for an Admin to review and publish.

---

## ⚙️ How to Run It Locally

Want to test it out on your own machine? 

**1. Clone the repo:**
```bash
git clone <your-repo-link>
cd EventBook
```

**2. Install dependencies:**
```bash
# For frontend
cd event-booking-app && npm install

# For backend
cd ../server && npm install
```

**3. Add your Environment Variables:**
Create a `.env` inside the `server/` folder and add:
```bash
PORT=5000
MONGO_URI=your_mongo_cloud_url
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

**4. Start it up:**
Run the backend in one terminal (`cd server && npm run dev`) and the frontend in another (`cd event-booking-app && npm start`).
