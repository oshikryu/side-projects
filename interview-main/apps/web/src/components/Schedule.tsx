import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { toast } from "sonner";
import scheduleStore from "../stores/ScheduleStore";
import { api } from "../trpc/react";
import ErrorSchedule from "./ErrorSchedule";
import FairnessTag from "./FairnessTag";
import ScheduleSkeleton from "./ScheduleSkeleton";
import { mobxPrint } from "../lib/utils";

interface ScheduleProps {
	dateRange: { start: string; end: string };
}

const Schedule = observer(({ dateRange }: ScheduleProps) => {
	const profilesQuery = api.profile.getAll.useQuery();
	const preferencesQuery = api.shiftPreference.getAll.useQuery();

	const { data: profiles, isLoading: isLoadingProfiles, isError: isErrorProfiles } = profilesQuery;
	const { data: preferences, isLoading: isLoadingPreferences, isError: isErrorPreferences } = preferencesQuery;

	useEffect(() => {
		if (isErrorProfiles || isErrorPreferences) {
			toast.error("Failed to load schedule data");
		}
	}, [isErrorProfiles, isErrorPreferences]);

	useEffect(() => {
		if (preferences && profiles) {
			scheduleStore.setInitialData({
				profiles,
				preferences,
				assignments: structuredClone(preferences), // initial assignments are set to the preferences
				startDate: dateRange.start,
				endDate: dateRange.end,
			});
		}
	}, [profiles, preferences, dateRange]);

	if (isLoadingProfiles || isLoadingPreferences) return <ScheduleSkeleton />;

	if (isErrorProfiles || isErrorPreferences) {
		return (
			<ErrorSchedule
				onRefetch={() =>
					Promise.all([profilesQuery.refetch(), preferencesQuery.refetch()])
				}
			/>
		);
	}

	return (
		<div className="w-fit">
			{Object.keys(scheduleStore.profiles).map((profileId) => (
				<ScheduleRow key={profileId} profileId={profileId} />
			))}
		</div>
	);
});

// TODO: debounce
const onClickDate = (profileId: string, shiftIdx: number, shift) => {
	mobxPrint(shift)
	if (shift == null) {
		scheduleStore.addAssignment(profileId, shiftIdx)
	} else {
		scheduleStore.removeAssignment(profileId, shiftIdx, shift.date)
	}
}

const ScheduleRow = observer(({ profileId }: { profileId: string }) => {
	const row = scheduleStore.getScheduleRow(profileId);
	if (!row) return null;

	return (
		<div className="flex h-11">
			<div className="flex w-56 flex-shrink-0 items-center justify-between border-b border-l border-r">
				<p className="flex-shrink-0 whitespace-nowrap py-2 pl-2">
					{row.fullName}
				</p>
				<FairnessTag fairnessScore={row.fairnessScore} />
			</div>
			<div className="flex">
				{row.shifts.map((shift, shiftIdx) => (
					<div
						onClick={() => onClickDate(row.profileId, shiftIdx, shift)}
						key={`${row.profileId}-${shiftIdx}`}
						className="flex w-14 items-center justify-center border-b border-r py-2"
					>
						{shift ? "X" : " "}
					</div>
				))}
			</div>
		</div>
	);
});

export default Schedule;
