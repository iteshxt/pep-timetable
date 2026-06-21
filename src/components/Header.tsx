"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  const [dateTime, setDateTime] = useState<{
    time: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const today = new Date();
      const hours = today.getHours();
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const timeStr = `${displayHours}:${minutes} ${ampm}`;

      const weekday = today.toLocaleDateString("en-US", { weekday: "short" });
      const month = today.toLocaleDateString("en-US", { month: "short" });
      const day = today.getDate();
      const dateStr = `${weekday}, ${month} ${day}`;

      setDateTime({
        time: timeStr,
        date: dateStr,
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.branding}>
        <Image
          src="/mascot.png"
          alt="Mascot"
          width={36}
          height={36}
          className={styles.mascot}
          priority
        />
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>PEP Timetable</h1>
          <span className={styles.subtitle}>Daily Schedule</span>
        </div>
      </div>

      <div className={styles.divider} />

      {dateTime ? (
        <div className={styles.dateTimeBadge} title="Current Date and Time">
          <div className={styles.timeText}>{dateTime.time}</div>
          <div className={styles.dateText}>{dateTime.date}</div>
        </div>
      ) : (
        <div style={{ width: 85, height: 35 }} />
      )}
    </header>
  );
}
