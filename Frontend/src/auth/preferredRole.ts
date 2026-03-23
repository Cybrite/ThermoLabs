import { PROFESSOR_ROLE_NAME, STUDENT_ROLE_NAME, type RoleName } from "./roles";

const PREFERRED_ROLE_STORAGE_KEY = "thermolabs.preferred_role";

const isRoleName = (value: string | null): value is RoleName =>
  value === PROFESSOR_ROLE_NAME || value === STUDENT_ROLE_NAME;

export const getStoredPreferredRole = (): RoleName | null => {
  const role = window.localStorage.getItem(PREFERRED_ROLE_STORAGE_KEY);
  return isRoleName(role) ? role : null;
};

export const setStoredPreferredRole = (role: RoleName): void => {
  window.localStorage.setItem(PREFERRED_ROLE_STORAGE_KEY, role);
};
