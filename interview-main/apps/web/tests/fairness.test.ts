import { calculateFairnessScore } from "@/lib/utils";
import { describe, expect, it } from "bun:test";

describe("calculateFairness", () => {
  it("should return a fairness score of 100 when preferences and assignments are equivalent", () => {
    const preferences = {
      "2024-09-17": { profileId: "profile1", date: "2024-09-17" },
      "2024-09-18": { profileId: "profile1", date: "2024-09-18" },
    };
    const assignments = {
      "2024-09-17": { profileId: "profile1", date: "2024-09-17" },
      "2024-09-18": { profileId: "profile1", date: "2024-09-18" },
    };

    const result = calculateFairnessScore(preferences, assignments);
    expect(result).toEqual(100);
  });
});
