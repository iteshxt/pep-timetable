"use client";

import React from "react";
import styles from "./FooterControls.module.css";
import { UserIcon, UsersIcon, SunMoonIcon } from "./Icons";

interface FooterControlsProps {
  activeTab: "itesh" | "ukie" | "both";
  setActiveTab: (tab: "itesh" | "ukie" | "both") => void;
  theme: "system" | "light" | "dark";
  setTheme: (theme: "system" | "light" | "dark") => void;
}

export default function FooterControls({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
}: FooterControlsProps) {
  const handleCycleUser = () => {
    if (activeTab === "ukie") {
      setActiveTab("itesh");
    } else if (activeTab === "itesh") {
      setActiveTab("both");
    } else {
      setActiveTab("ukie");
    }
  };

  const handleCycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const getCycleButtonDetails = () => {
    switch (activeTab) {
      case "ukie":
        return {
          className: `${styles.cyclePill} ${styles.ukieActive}`,
          icon: <UserIcon size={18} />,
          name: "Ukie",
          title: "Schedule: Ukie. Click to cycle to Itesh",
        };
      case "itesh":
        return {
          className: `${styles.cyclePill} ${styles.iteshActive}`,
          icon: <UserIcon size={18} />,
          name: "Itesh",
          title: "Schedule: Itesh. Click to cycle to Both",
        };
      case "both":
        return {
          className: `${styles.cyclePill} ${styles.bothActive}`,
          icon: <UsersIcon size={18} />,
          name: "Both",
          title: "Schedule: Both. Click to cycle to Ukie",
        };
    }
  };

  const cycleDetails = getCycleButtonDetails();

  const getThemeText = () => {
    switch (theme) {
      case "system":
        return "Theme: System";
      case "light":
        return "Theme: Light";
      case "dark":
        return "Theme: Dark";
    }
  };

  return (
    <div className={styles.footerControls}>
      <button
        onClick={handleCycleUser}
        className={cycleDetails.className}
        title={cycleDetails.title}
      >
        {cycleDetails.icon}
        <span className={styles.cycleText}>{cycleDetails.name}</span>
      </button>

      <div
        onClick={handleCycleTheme}
        className={styles.themePill}
        title="Cycle theme (System → Light → Dark)"
      >
        <span className={styles.themeText}>{getThemeText()}</span>
        <div className={styles.themeIconCircle}>
          <SunMoonIcon size={18} />
        </div>
      </div>
    </div>
  );
}
