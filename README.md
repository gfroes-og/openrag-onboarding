# OpenGov Onboarding Concept

Hi there! This is a **concept demo** I built to show what a next-generation onboarding platform for OpenGov could look like. It's designed to be more than just a checklist—it's a personalized journey for new hires, powered by data-driven personality insights to help build stronger teams from day one.

The heart of this demo is my **KNOW Personality Assessment**, a tool I developed to provide real insights into how people work and communicate best. My hope is that it can help OpenGov build even better teams.

---

## Live Demo

**[Explore the Live Demo here](http://guiggsrag.vercel.app)**

---

## The KNOW Personality Test

The centerpiece of this project is the **KNOW Personality Assessment**, a DISC-based framework I've refined over the years. For additional context on this methodology, check out this animated book summary of [Thomas Erikson's work](https://www.youtube.com/watch?v=5_aRNG-02ZY), which explains the same foundational concepts that inspired the KNOW test. It helps categorize people into one of four profiles:

- **K - King** (Red): Decisive, goal-oriented leaders.
- **N - Navigator** (Blue): Strategic, analytical thinkers.
- **O - Oracle** (Yellow): Creative, insightful communicators.
- **W - Warrior** (Green): Dependable, collaborative team players.

By understanding these profiles, OpenGov can build more balanced teams, improve communication, and give new hires the support they need to thrive. The test data is in `app/lib/mockData.js` if you want to see how it works.

---

## Key Features

- **Personalized Onboarding:** The journey starts with the personality test, which helps tailor the experience for each new hire.
- **Progress Dashboard:** A simple dashboard to track progress through training documents and videos.
- **All-in-One Content:** An integrated PDF reader and video player keeps all essential materials in one place.
- **AI Assistant:** An AI-powered chat assistant is here to answer questions 24/7 using RAG.

---

## Tech Stack & Vision

This demo is built with a modern frontend stack (**Next.js** and **Tailwind CSS**). For this concept, data is currently handled with local mock data (for the personality test) and browser local storage.

The vision is to evolve this into a production-ready application leveraging OpenGov's preferred cloud infrastructure:

- **Authentication**: Cloudflare Workers with Auth0 for secure and flexible user management.
- **Database**: Cloudflare D1 for a serverless, persistent database.
- **File Storage**: Cloudflare R2 for scalable and cost-effective storage of documents and videos.
- **Configuration**: Cloudflare KV for storing configuration data and feature flags.

---

## What's Next?

This is just a starting point! Here are some ideas for taking it from a concept to a fully functional platform:

- **Cloudflare Integration**: Transition from mock data and local storage to a persistent database (Cloudflare D1), file storage (Cloudflare R2), and configuration (Cloudflare KV).
- **Full User Authentication**: Integrate a provider like Auth0 using Cloudflare Workers for a secure login experience.
- **UI/UX Polish**: Refine the layout and fix any remaining bugs for a smoother user experience.
- **Admin Dashboard**: Build a simple interface for managing onboarding content.
- **Gamification**: Add elements like points and badges to make the experience more engaging.

---

## Getting Started (For Developers)

```bash
# Clone the repo
git clone <repository-url>
cd openrag

# Install dependencies
yarn install

# Run the dev server
yarn dev
```
Open `http://localhost:3000` to see it in action.

---

## License & Usage

This project is shared publicly as a demonstration for OpenGov.

**Important Note on the KNOW Personality Test:**

The **KNOW Personality Test**, including its questions, methodology, and personality profiles, is the intellectual property of Guilherme Froes. Permission is granted exclusively to OpenGov to use, adapt, and integrate this test into its internal systems.

While the source code of this repository may be viewed publicly, this does not grant any right or license to third parties to copy, distribute, or use the KNOW Personality Test in any form. Its inclusion here is for demonstration purposes only. Any use of the KNOW Personality Test by any entity other than OpenGov requires explicit written permission from the creator.