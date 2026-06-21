"use client";

import React from "react";
import styles from "./StatusBanner.module.css";
import { ClockIcon, MapPinIcon, BookIcon, CoffeeIcon, SparklesIcon, TagIcon } from "./Icons";
import { TimeSlot, UserType } from "@/types/timetable";

interface StatusBannerProps {
  activeTab: "itesh" | "ukie" | "both";
  currentSlot: TimeSlot | null;
  liveTime: string;
  timeSlots: TimeSlot[];
}

export default function StatusBanner({
  activeTab,
  currentSlot,
  liveTime,
  timeSlots,
}: StatusBannerProps) {
  interface StatusInfo {
    title: string;
    details: string;
    type: "class" | "free" | "break";
    location?: string;
    timeLabel?: string;
    section?: string;
  }

  // Find the actual start time of the first class of the day for the selected view
  const getFirstClassTime = (): string => {
    for (const slot of timeSlots) {
      if ("type" in slot && slot.type === "common_break") continue;

      const iteshSlot = (slot as any).itesh;
      const ukieSlot = (slot as any).ukie;

      const hasIteshClass = iteshSlot && iteshSlot.type === "class";
      const hasUkieClass = ukieSlot && ukieSlot.type === "class";

      if (activeTab === "itesh" && hasIteshClass) {
        return slot.time.split("-")[0];
      }
      if (activeTab === "ukie" && hasUkieClass) {
        return slot.time.split("-")[0];
      }
      if (activeTab === "both" && (hasIteshClass || hasUkieClass)) {
        return slot.time.split("-")[0];
      }
    }
    return "10:00"; // Default fallback
  };

  const getStatusInfo = (): StatusInfo => {
    if (!liveTime) {
      return {
        title: "Waiting for system time",
        details: "Determining status...",
        type: "free",
      };
    }

    const [hours, minutes] = liveTime.split(":").map(Number);
    const currentTotal = hours * 60 + minutes;

    // 1. Before timetable hours (Start at 10:00)
    if (currentTotal < 600) {
      const firstTime = getFirstClassTime();
      return {
        title: "Classes haven't started yet",
        details: "Study or prepare for the first session",
        type: "free",
        timeLabel: `First class at ${firstTime}`,
      };
    }

    // 2. After timetable hours (End at 17:00)
    if (currentTotal >= 1020) {
      return {
        title: "All classes done for the day",
        details: "Time to rest and review notes",
        type: "free",
        timeLabel: "Classes finished",
      };
    }

    // 3. No current slot found
    if (!currentSlot) {
      return {
        title: "Free Time",
        details: "Relax or catch up on study",
        type: "free",
      };
    }

    // 4. Common Break
    if ("type" in currentSlot && currentSlot.type === "common_break") {
      return {
        title: "Lunch & Common Break",
        details: "Rest, grab a snack, and recharge",
        type: "break",
        timeLabel: currentSlot.time,
      };
    }

    // 5. Specific User Slot
    const getSingleUserInfo = (user: UserType, name: string): StatusInfo => {
      const slot = (currentSlot as any)[user];
      if (!slot || slot.type === "free") {
        return {
          title: `${name} is currently free`,
          details: "No scheduled class right now",
          type: "free",
          timeLabel: currentSlot.time,
        };
      }
      return {
        title: `${name}: ${slot.courseName}`,
        details: `Class ${slot.courseCode} is currently in session`,
        location: slot.location,
        section: slot.section,
        type: "class",
        timeLabel: currentSlot.time,
      };
    };

    if (activeTab === "itesh") {
      return getSingleUserInfo("itesh", "Itesh");
    } else if (activeTab === "ukie") {
      return getSingleUserInfo("ukie", "Ukie");
    } else {
      // Both Compare Tab
      const iteshSlot = (currentSlot as any).itesh;
      const ukieSlot = (currentSlot as any).ukie;

      const iteshInClass = iteshSlot && iteshSlot.type === "class";
      const ukieInClass = ukieSlot && ukieSlot.type === "class";

      if (iteshInClass && ukieInClass) {
        return {
          title: "Both are in classes",
          details: `Itesh: ${iteshSlot.courseCode} • Ukie: ${ukieSlot.courseCode}`,
          type: "class",
          timeLabel: currentSlot.time,
        };
      } else if (!iteshInClass && !ukieInClass) {
        return {
          title: "Both are currently free",
          details: "Catch up on work or grab a coffee",
          type: "free",
          timeLabel: currentSlot.time,
        };
      } else if (iteshInClass) {
        return {
          title: "Itesh in class • Ukie is free",
          details: `Itesh: ${iteshSlot.courseName} (${iteshSlot.courseCode})`,
          location: iteshSlot.location,
          section: iteshSlot.section,
          type: "class",
          timeLabel: currentSlot.time,
        };
      } else {
        return {
          title: "Ukie in class • Itesh is free",
          details: `Ukie: ${ukieSlot.courseName} (${ukieSlot.courseCode})`,
          location: ukieSlot.location,
          section: ukieSlot.section,
          type: "class",
          timeLabel: currentSlot.time,
        };
      }
    }
  };

  const status = getStatusInfo();

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.headerRow}>
          <div className={styles.statusIndicator}>
            <ClockIcon size={14} />
            <span>Right Now</span>
          </div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.statusText}>{status.title}</h2>
          <p className={styles.statusSubtext}>{status.details}</p>
          
          <div className={styles.statusDetails}>
            {status.timeLabel && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Time Slot</span>
                <div className={styles.detailValue}>
                  <ClockIcon size={13} />
                  <span>{status.timeLabel}</span>
                </div>
              </div>
            )}
            {status.location && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location</span>
                <div className={styles.detailValue}>
                  <MapPinIcon size={13} />
                  <span>Room {status.location}</span>
                </div>
              </div>
            )}
            {status.section && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Section</span>
                <div className={styles.detailValue}>
                  <TagIcon size={13} />
                  <span>Sec {status.section}</span>
                </div>
              </div>
            )}
            <div className={`${styles.detailItem} ${styles.typeBadge}`}>
              <span className={styles.detailLabel}>Status</span>
              <div className={styles.detailValue}>
                {status.type === "class" && <BookIcon size={13} />}
                {status.type === "free" && <SparklesIcon size={13} />}
                {status.type === "break" && <CoffeeIcon size={13} />}
                <span style={{ textTransform: "capitalize" }}>{status.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
