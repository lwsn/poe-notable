export type JewelType = {
  id: string;
  name: string;
  icon: string;
  tag: string;
  stats: string[];
  enchant: string[];
  size: "Small" | "Medium" | "Large";
  prefixWeight: number;
  suffixWeight: number;
  notables: {
    name: string;
    skill: number;
    type: "Prefix" | "Suffix";
    weight: number;
  }[];
};

export type NotableType = {
  skill: number;
  name: string;
  isKeystone?: boolean;
  isNotable?: boolean;
  stats: string[];
  icon: string;
  reminderText?: string[];
  flavourText?: string[];
  level?: number;
  type?: "Prefix" | "Suffix";
  weight?: { [key in string]: number };
};
