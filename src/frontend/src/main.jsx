import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./core/style/global.css";

import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home-page.jsx";
import HomeLayout from "@/core/components/layouts/home-layout.jsx";
import ProjectListPage from "./pages/project/project-list-page.jsx";
import ResourcePage from "./pages/resource-page.jsx";
import NFTsPage from "./pages/nft/nft-list-page";
import ProjectDetailPage from "./pages/project/project-detail-page";
import CommunityDashboardPage from "./pages/community-page";
import BalancePage from "./pages/balance-page";
import { AuthProvider } from "@/core/providers/auth-provider";
import MyProjectsPage from "./pages/my-project-page";
import ScrollToTop from "@/core/components/scroll-to-top";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/resources" element={<ResourcePage />} />
            <Route path="/nfts" element={<NFTsPage />} />
            <Route path="/community" element={<CommunityDashboardPage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="/my-projects" element={<MyProjectsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
