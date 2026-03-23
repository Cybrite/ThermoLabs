import type { User } from "@auth0/auth0-react";

export const PROFESSOR_ROLE_ID = "rol_QzE4ACypMEmHHhPy";
export const STUDENT_ROLE_ID = "rol_4P8wjoIEAFhGnxy8";
export const PROFESSOR_ROLE_NAME = "professor";
export const STUDENT_ROLE_NAME = "student";

export type RoleName = "professor" | "student";

const POSSIBLE_ROLE_CLAIMS = [
  "roles",
  "role_ids",
  "https://thermolabs.app/roles",
  "https://thermolabs.app/role_ids",
];

const normalizeRoleValue = (value: string) => value.trim().toLowerCase();

const claimToArray = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

export const getRoleValues = (user: User | undefined): string[] => {
  if (!user) return [];

  const userRecord = user as Record<string, unknown>;
  const roles = POSSIBLE_ROLE_CLAIMS.flatMap((claim) =>
    claimToArray(userRecord[claim]),
  );

  return [...new Set(roles.map((role) => role.trim()).filter(Boolean))];
};

export const hasProfessorRole = (roleValues: string[]): boolean => {
  const normalizedRoles = roleValues.map(normalizeRoleValue);
  return (
    roleValues.includes(PROFESSOR_ROLE_ID) ||
    normalizedRoles.includes(PROFESSOR_ROLE_NAME)
  );
};

export const hasStudentRole = (roleValues: string[]): boolean => {
  const normalizedRoles = roleValues.map(normalizeRoleValue);
  return (
    roleValues.includes(STUDENT_ROLE_ID) ||
    normalizedRoles.includes(STUDENT_ROLE_NAME)
  );
};

export const roleIdFor = (role: RoleName): string =>
  role === PROFESSOR_ROLE_NAME ? PROFESSOR_ROLE_ID : STUDENT_ROLE_ID;

export const roleLabel = (role: RoleName): string =>
  role === PROFESSOR_ROLE_NAME ? "Professor" : "Student";
