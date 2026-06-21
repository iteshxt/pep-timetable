"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import StatusBanner from "@/components/StatusBanner";
import TimeSlotCard from "@/components/TimeSlotCard";
import FooterControls from "@/components/FooterControls";
import timetableData from "@/../timetable.json";
import styles from "./page.module.css";
import { TimeSlot } from "@/types/timetable";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"itesh" | "ukie" | "both">("ukie");
  const [liveTime, setLiveTime] = useState("");
  const [theme, setThemeState] = useState<"system" | "light" | "dark">("system");

  const timeSlots = (timetableData as { timeSlots: TimeSlot[] }).timeSlots;
  const notifiedSlotsRef = useRef<Record<number, boolean>>({});

  // Request notifications permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Register PWA Service Worker for installability and offline support
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (reg) => console.log("PWA: SW registered", reg.scope),
          (err) => console.log("PWA: SW registration failed", err)
        );
      });
    }
  }, []);

  // Track live client time to avoid hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      setLiveTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Theme configuration loader & listener
  useEffect(() => {
    const savedTheme = localStorage.getItem("pep-timetable-theme") as "system" | "light" | "dark";
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: "system" | "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("pep-timetable-theme", newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
      } else if (theme === "light") {
        root.setAttribute("data-theme", "light");
      } else {
        // system
        if (mediaQuery.matches) {
          root.setAttribute("data-theme", "dark");
        } else {
          root.setAttribute("data-theme", "light");
        }
      }
    };

    applyTheme();

    if (theme === "system") {
      const listener = () => applyTheme();
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  // Send notifications 10 minutes before class starts
  useEffect(() => {
    if (!liveTime) return;

    const [hours, minutes] = liveTime.split(":").map(Number);
    const currentTotal = hours * 60 + minutes;

    // Slot Start Times in minutes from midnight
    const slotsMinutes = [
      { start: 10 * 60, index: 0 },
      { start: 11 * 60, index: 1 },
      { start: 12 * 60, index: 2 },
      { start: 13 * 60, index: 3 }, // Common Break
      { start: 14 * 60, index: 4 },
      { start: 15 * 60, index: 5 },
      { start: 16 * 60, index: 6 },
    ];

    slotsMinutes.forEach(({ start, index }) => {
      // Check if it is exactly 10 minutes before start
      if (currentTotal === start - 10 && !notifiedSlotsRef.current[index]) {
        const slot = timeSlots[index];
        if ("type" in slot && slot.type === "common_break") {
          return; // Skip alerts for breaks
        }

        const notificationsToSend: string[] = [];
        const iteshSlot = (slot as any).itesh;
        const ukieSlot = (slot as any).ukie;

        // Collect class notices according to active view configuration
        if ((activeTab === "itesh" || activeTab === "both") && iteshSlot && iteshSlot.type === "class") {
          notificationsToSend.push(`Itesh: ${iteshSlot.courseCode} - ${iteshSlot.courseName} in Room ${iteshSlot.location}`);
        }
        if ((activeTab === "ukie" || activeTab === "both") && ukieSlot && ukieSlot.type === "class") {
          notificationsToSend.push(`Ukie: ${ukieSlot.courseCode} - ${ukieSlot.courseName} in Room ${ukieSlot.location}`);
        }

        if (
          notificationsToSend.length > 0 &&
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          notificationsToSend.forEach((bodyText) => {
            new Notification("Class Starting in 10 Minutes!", {
              body: bodyText,
              icon: "/mascot.png",
            });
          });
          notifiedSlotsRef.current[index] = true;
        }
      }
    });
  }, [liveTime, activeTab, timeSlots]);

  const getSlotIndexFromTime = (timeStr: string) => {
    if (!timeStr) return -1;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const currentTotal = hours * 60 + minutes;

    const slotsMinutes = [
      { start: 10 * 60, end: 11 * 60 },
      { start: 11 * 60, end: 12 * 60 },
      { start: 12 * 60, end: 13 * 60 },
      { start: 13 * 60, end: 14 * 60 },
      { start: 14 * 60, end: 15 * 60 },
      { start: 15 * 60, end: 16 * 60 },
      { start: 16 * 60, end: 17 * 60 },
    ];

    for (let i = 0; i < slotsMinutes.length; i++) {
      const { start, end } = slotsMinutes[i];
      if (currentTotal >= start && currentTotal < end) {
        return i;
      }
    }
    return -1;
  };

  const activeSlotIndex = getSlotIndexFromTime(liveTime);
  const currentSlot = activeSlotIndex !== -1 ? timeSlots[activeSlotIndex] : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgImage} />
      <Header />

      <main className={styles.mainContent}>
        <StatusBanner
          activeTab={activeTab}
          currentSlot={currentSlot}
          liveTime={liveTime}
          timeSlots={timeSlots}
        />

        <section className={styles.timelineSection}>
          {timeSlots.map((slot, index) => (
            <TimeSlotCard
              key={index}
              slot={slot}
              activeTab={activeTab}
              isActive={index === activeSlotIndex}
            />
          ))}
        </section>
      </main>

      <FooterControls
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
}
