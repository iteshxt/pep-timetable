export interface ClassSlotDetail {
  type: "class";
  courseCode: string;
  courseName: string;
  section: string;
  location: string;
}

export interface FreeSlotDetail {
  type: "free";
}

export type SlotDetail = ClassSlotDetail | FreeSlotDetail;

export interface IndividualTimeSlot {
  time: string;
  itesh: SlotDetail;
  ukie: SlotDetail;
}

export interface CommonBreakTimeSlot {
  time: string;
  type: "common_break";
}

export type TimeSlot = IndividualTimeSlot | CommonBreakTimeSlot;

export interface TimetableData {
  timeSlots: TimeSlot[];
}

export type UserType = "itesh" | "ukie";
