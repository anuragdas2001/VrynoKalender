export function geCurrentViewPerModulePerInstancePerUser(
  cookieUserId: string,
  instanceId: string
) {
  let currentDashboardViewPerModulePerInstancePerUser = localStorage.getItem(
    "currentDashboardViewPerModulePerInstancePerUser"
  );
  let currentDashboardView =
    currentDashboardViewPerModulePerInstancePerUser ?? {};

  let updatedcurrentDashboardView =
    currentDashboardView && Object.keys(currentDashboardView)?.length > 0
      ? {
          ...JSON.parse(currentDashboardView.toString()),
        }
      : {};
  updatedcurrentDashboardView[cookieUserId as string] = {
    ...updatedcurrentDashboardView[cookieUserId as string],
  };
  updatedcurrentDashboardView[cookieUserId as string][instanceId as string] = {
    ...updatedcurrentDashboardView[cookieUserId as string][
      instanceId as string
    ],
  };
  return updatedcurrentDashboardView;
}
