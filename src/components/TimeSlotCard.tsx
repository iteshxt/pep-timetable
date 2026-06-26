"use client";

import React from "react";
import styles from "./TimeSlotCard.module.css";
import { TimeSlot, SlotDetail, UserType, IndividualTimeSlot } from "@/types/timetable";
import { MapPinIcon, CoffeeIcon } from "./Icons";

interface TimeSlotCardProps {
  slot: TimeSlot;
  activeTab: "itesh" | "ukie" | "both";
  isActive: boolean;
}

const UserCard = ({
  userName,
  userKey,
  detail,
  time,
  isActive,
  showUserBadge = false,
}: {
  userName: string;
  userKey: UserType;
  detail: SlotDetail;
  time: string;
  isActive: boolean;
  showUserBadge?: boolean;
}) => {
  const isClass = detail.type === "class";
  const [timeStart, timeEnd] = time.split("-");

  // Determine course-specific style class
  const getCardStyleClass = () => {
    if (!isClass) return styles.freeCard;
    const courseName = detail.courseName.toLowerCase();
    const courseCode = detail.courseCode.toLowerCase();
    if (courseCode.includes("cses003") || courseCode.includes("cses001") || courseName.includes("data structure")) {
      return styles.dsaCard;
    }
    if (courseCode.includes("pevs10") || courseName.includes("verbal")) {
      return styles.verbalCard;
    }
    return styles.classCard; // fallback class card
  };

  const cardClass = `${styles.card} ${getCardStyleClass()} ${
    isActive ? styles.activeSlot : ""
  }`;

  return (
    <div className={cardClass}>
      {/* Column 1: Time */}
      <div className={styles.timeSection}>
        <span className={styles.timeTextStart}>{timeStart}</span>
        <span className={styles.timeTextDivider}>to</span>
        <span className={styles.timeTextEnd}>{timeEnd}</span>
      </div>

      {/* Column 2: Info */}
      <div className={styles.infoSection}>
        <div className={styles.cardHeader}>
          {isClass ? (
            <span className={styles.courseMetaLabel}>
              {detail.courseCode} &bull; Sec {detail.section}
            </span>
          ) : (
            <span className={styles.courseMetaLabel}>Free Period</span>
          )}
          {showUserBadge && (
            <span
              className={`${styles.userBadge} ${
                userKey === "itesh" ? styles.iteshBadge : styles.ukieBadge
              }`}
            >
              {userName}
            </span>
          )}
        </div>

        <h3 className={styles.courseName}>
          {isClass ? detail.courseName : "Free Time"}
        </h3>
      </div>

      {/* Column 3: Prominent Room Code (Right Side) */}
      {isClass && (
        <div className={styles.roomSection}>
          <div className={styles.roomBadge}>
            <MapPinIcon size={14} />
            <span className={styles.roomText}>{detail.location}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const BothUsersCard = ({
  slot,
  time,
  isActive,
}: {
  slot: IndividualTimeSlot;
  time: string;
  isActive: boolean;
}) => {
  const [timeStart, timeEnd] = time.split("-");
  
  
  const getRowStyleClass = (detail: SlotDetail) => {
    if (detail.type !== "class") return styles.freeRow;
    const courseName = detail.courseName.toLowerCase();
    const courseCode = detail.courseCode.toLowerCase();
    if (courseCode.includes("cses003") || courseCode.includes("cses001") || courseName.includes("data structure")) {
      return styles.dsaRow;
    }
    if (courseCode.includes("pevs10") || courseName.includes("verbal")) {
      return styles.verbalRow;
    }
    return styles.classRow;
  };

  const cardClass = `${styles.card} ${styles.compareCard} ${
    isActive ? styles.activeSlot : ""
  }`;

  return (
    <div className={cardClass}>
      {/* Column 1: Time (Displayed Once) */}
      <div className={styles.timeSection}>
        <span className={styles.timeTextStart}>{timeStart}</span>
        <span className={styles.timeTextDivider}>to</span>
        <span className={styles.timeTextEnd}>{timeEnd}</span>
      </div>

      {/* Column 2: Consolidated Rows */}
      <div className={styles.rowsContainer}>
        {/* Itesh Row */}
        <div className={`${styles.userRow} ${getRowStyleClass(slot.itesh)}`}>
          <div className={styles.userRowHeader}>
            <span className={`${styles.userBadge} ${styles.iteshBadge}`}>Itesh</span>
            {slot.itesh.type === "class" ? (
              <span className={styles.courseMetaLabel}>
                {slot.itesh.courseCode} &bull; Sec {slot.itesh.section}
              </span>
            ) : (
              <span className={styles.courseMetaLabel}>Free Period</span>
            )}
          </div>
          <div className={styles.userRowContent}>
            <h4 className={styles.courseNameSub}>
              {slot.itesh.type === "class" ? slot.itesh.courseName : "Free Time"}
            </h4>
            {slot.itesh.type === "class" && (
              <div className={styles.miniRoomBadge}>
                <MapPinIcon size={11} />
                <span>Room {slot.itesh.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.rowDivider} />

        {/* Ukie Row */}
        <div className={`${styles.userRow} ${getRowStyleClass(slot.ukie)}`}>
          <div className={styles.userRowHeader}>
            <span className={`${styles.userBadge} ${styles.ukieBadge}`}>Ukie</span>
            {slot.ukie.type === "class" ? (
              <span className={styles.courseMetaLabel}>
                {slot.ukie.courseCode} &bull; Sec {slot.ukie.section}
              </span>
            ) : (
              <span className={styles.courseMetaLabel}>Free Period</span>
            )}
          </div>
          <div className={styles.userRowContent}>
            <h4 className={styles.courseNameSub}>
              {slot.ukie.type === "class" ? slot.ukie.courseName : "Free Time"}
            </h4>
            {slot.ukie.type === "class" && (
              <div className={styles.miniRoomBadge}>
                <MapPinIcon size={11} />
                <span>Room {slot.ukie.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommonBreakCard = ({ time, isActive }: { time: string; isActive: boolean }) => {
  const [timeStart, timeEnd] = time.split("-");
  const cardClass = `${styles.card} ${styles.breakCard} ${isActive ? styles.activeSlot : ""}`;

  return (
    <div className={cardClass}>
      <div className={styles.timeSection}>
        <span className={styles.timeTextStart}>{timeStart}</span>
        <span className={styles.timeTextDivider}>to</span>
        <span className={styles.timeTextEnd}>{timeEnd}</span>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.cardHeader}>
          <span className={styles.courseMetaLabel}>Lunch Break</span>
        </div>

        <h3 className={styles.courseName}>Common Break / Lunch</h3>
      </div>

      <div className={styles.roomSection}>
        <div className={styles.roomBadge}>
          <CoffeeIcon size={14} />
          <span className={styles.roomText}>Break</span>
        </div>
      </div>
    </div>
  );
};

export default function TimeSlotCard({ slot, activeTab, isActive }: TimeSlotCardProps) {
  const isCommonBreak = "type" in slot && slot.type === "common_break";

  return (
    <div className={styles.container}>
      <div className={styles.cardsContainer}>
        {isCommonBreak ? (
          <CommonBreakCard time={slot.time} isActive={isActive} />
        ) : activeTab === "both" ? (
          <BothUsersCard slot={slot as IndividualTimeSlot} time={slot.time} isActive={isActive} />
        ) : (
          <>
            {activeTab === "itesh" && (
              <UserCard
                userName="Itesh"
                userKey="itesh"
                detail={(slot as any).itesh}
                time={slot.time}
                isActive={isActive}
              />
            )}
            {activeTab === "ukie" && (
              <UserCard
                userName="Ukie"
                userKey="ukie"
                detail={(slot as any).ukie}
                time={slot.time}
                isActive={isActive}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
