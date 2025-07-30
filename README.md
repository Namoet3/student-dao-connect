# UniversityDAO – Decentralized Student Work & Internship Platform

UniversityDAO is a Web 3.0 marketplace that connects university talent with real-world projects and short-term internships.  
By automating **escrow**, **payment release**, and **reputation tracking** through smart contracts, the platform brings **trust, transparency, and speed** to both students and employers.

---

## ✨ Key Value Proposition
| Problem | Our Solution |
|---------|--------------|
| High fees and opaque processes on traditional freelance sites | **DAO-governed escrow** with a < 5 % protocol fee & on-chain auditability |
| Students struggle to gain verifiable paid experience | **Reputation tokens** + NFT certificates form an immutable portfolio |
| Companies need flexible, low-overhead help for micro-tasks | Self-service project board, milestone payouts & optional mentor QA |

---

## 🏆 Core Features (MVP)
- **Project Marketplace** – post, browse, and apply for projects/bounties  
- **Escrow & Delivery Flow** – funds are locked on assignment and released on approval  
- **Reputation Engine** – on-chain score and badges for every successful delivery  
- **Wallet Login** – MetaMask (EVM) with optional email magic-link for Web 2.5 users  
- **DAO Governance** – token holders vote on disputes, fees, and roadmap items  

Planned extensions: real-time chat, AI project matching, multi-currency support, mobile app, and multi-chain deployment.

---

## 🧰 Built With
- **Vite** – lightning-fast dev server & bundler  
- **TypeScript** – type-safe development across front-end & scripts  
- **React** – component-based UI library  
- **shadcn-ui** – accessible, unstyled component primitives  
- **Tailwind CSS** – utility-first styling  

> **Note:** shadcn-ui components are built on top of Radix UI and styled via Tailwind.

---

## ⚙️ Tech Stack (Full List)
```
| Layer | Technology |
|-------|------------|
| Front-end | Vite, React 18, TypeScript, shadcn-ui, Tailwind CSS |
| State / Data | React Query, Supabase JS |
| Web 3 | wagmi, ethers.js, MetaMask |
| Smart Contracts | Solidity 0.8.x, Hardhat |
| Storage | IPFS / Arweave |
| Tooling | ESLint, Prettier, Vitest, Husky, Commitlint |
```
---

## 🚀 Getting Started
```
npm install

npm run dev
```
---

## 📂 Repository Structure

```student-dao-connect/
├── public/ → Static assets (favicons, images, etc.)
├── src/ → Main front-end source code
│ ├── components/ → Reusable UI components (shadcn-ui based)
│ ├── hooks/ → Custom hooks (e.g., Supabase, Web3)
│ ├── pages/ → Route-level components (project views, dashboard, etc.)
│ ├── lib/ → Utility/helper functions
│ └── contracts/ → Auto-generated contract ABIs
├── supabase/ → SQL migrations, edge functions, DB config
└── hardhat/ → Solidity smart contracts and tests
```
---


## 📜 License
Distributed under the MIT License. See LICENSE for more information.

---

## 🙏 Acknowledgements
Lovable AI – initial scaffolding

Supabase – instant Postgres backend & auth

wagmi, ethers, hardhat – open-source Web 3 tooling

Early student testers & mentor community
