import { Prisma } from '@prisma/client';

export const sessionSelect: Prisma.SessionSelect = {
  id: true,
  expiresAt: true,
};

export const accountSelect: Prisma.AccountSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  dateOfBirth: true,
};

export const accountAuthSelect: Prisma.AccountSelect = {
  id: true,
  email: true,
  password: true,
};
