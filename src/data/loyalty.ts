export const loyaltyLevels = [
  {
    id: 0,
    pill: "Level 1",
    title: "House Guest",
    copy: "Get a 5% extra discount after your first stay.",
    art: "drive" as const,
  },
  {
    id: 1,
    pill: "Level 2",
    title: "Return Stay",
    copy: "Get a 10% extra discount after 4 stays.",
    art: "fly" as const,
  },
  {
    id: 2,
    pill: "Level 3",
    title: "House Regular",
    copy: "Get a 15% extra discount after 10 stays.",
    art: "desk" as const,
  },
] as const;
