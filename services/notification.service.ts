import { apiRequest } from "@/services/api";
import type { TaskAssignmentNotificationDto } from "@/components/TaskAssignmentNotifications";

export async function getPendingNotifications() {
  return apiRequest("/notifications/pending");
}

export async function getNotifications(): Promise<TaskAssignmentNotificationDto[]> {
  return apiRequest<TaskAssignmentNotificationDto[]>("/notifications");
}

export async function acceptNotification(notificationId: string): Promise<void> {
  return apiRequest(`/notifications/${notificationId}/accept`, {
    method: "POST",
  });
}

export async function refuseNotification(notificationId: string): Promise<void> {
  return apiRequest(`/notifications/${notificationId}/refuse`, {
    method: "POST",
  });
}

export async function getReceivedNotifications() {
  return apiRequest("/notifications/received");
}
