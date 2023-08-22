import useSWR from "swr";

import { getTimeline } from "../../utils/api/timeline";

export const useTimelineData = (query) => {
  const { ref, refId, user, pageSize } = query;
  let filters = `&sort=createdAt:desc&pagination[pageSize]=${pageSize || 10}`;
  filters += ref ? `&filters[$and][0][ref][$eq]=${ref}` : "";
  filters += refId ? `&filters[$and][1][refId][$eq]=${refId}` : "";
  filters += user ? `&filters[user][id][$eq]=${user}` : ``;

  return useSWR(!query ? null : `/timelines?populate=*${filters}`, getTimeline);
};
export const useMessageData = (query) => {
  const { ref, refId, pageSize } = query;
  let filters = `&sort=createdAt:desc&pagination[pageSize]=${pageSize || 10}`;
  filters += ref ? `&filters[$and][0][ref][$eq]=${ref}` : "";
  filters += refId ? `&filters[$and][1][refId][$eq]=${refId}` : "";
  return useSWR(
    !query.refId ? null : `/messages?populate=*${filters}`,
    getTimeline
  );
};
