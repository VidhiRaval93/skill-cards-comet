# 🧠 Comet Skills Dashboard – Building Agentic UX on Perplexity

This is a full-stack prototype of a programmable skills layer for Perplexity Comet. It imagines what Perplexity would look like if users could install mini agents to automate common workflows — all grounded in their real-time research context.

## 🔭 Vision

Perplexity has redefined search. The next frontier is **agentic interfaces** — where users don’t just search, but teach the system what to do, and build workflows that compound over time.

Our hypothesis: Every power user has repeat tasks they wish Perplexity could just handle for them. We built a “Skills Dashboard” — a front-end to install and launch AI-powered microtasks on top of Comet.

## ⚙️ What We’ve Built

- **Skill Gallery UI**: Beautiful dashboard of assistant/browser skills (email/calendar vs web queries)
- **Dual-Mode Execution**: Each skill can run in Comet Assistant or Comet Browser via Playwright CDP
- **Chrome Debug Automation**: Realtime prompt typing, submission, and auto-response handling
- **Memory Layer (WIP)**: Save + visualize queries across time, source, and topic
- **Backend APIs**: FastAPI + skill execution handler

## ✨ Sample Skills

- 📧 “Summarize Emails from Today”
- 📅 “Set 1:1 with [Name]”
- 🌐 “Find trending AI news”
- 📰 “Summarize newsletter headlines”

## 📍 What’s Next

- [ ] Allow users to create + save their own skills
- [ ] Automatically recommend skills based on behavior
- [ ] Integrate with Clause for deeper browser automation
- [ ] Persist memory layer into Perplexity account
- [ ] Add team/collaborative agents

This is an evolving prototype — one Perplexity agent a day. Feedback welcome!
