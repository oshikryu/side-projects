import { observer } from "mobx-react-lite";

const FairnessTag = observer(
  ({ fairnessScore }: { fairnessScore?: number }) => {
    let bgColor;

    if (
      fairnessScore === undefined ||
      fairnessScore < 0 ||
      fairnessScore > 100
    ) {
      bgColor = "#E5E5E5"; // gray
    } else if (fairnessScore >= 0 && fairnessScore <= 33) {
      bgColor = "#FFAEC8"; // red
    } else if (fairnessScore > 33 && fairnessScore <= 66) {
      bgColor = "#FFE2CD"; // yellow
    } else if (fairnessScore > 66 && fairnessScore <= 100) {
      bgColor = "#D9E9D5"; // green
    }

    return (
      <div
        style={{ backgroundColor: bgColor }}
        className="mr-2 w-14 rounded-full py-1"
      >
        <div className="text-center text-sm">
          {fairnessScore !== undefined ? Math.round(fairnessScore) : "--"}%
        </div>
      </div>
    );
  },
);

export default FairnessTag;
