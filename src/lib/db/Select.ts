import { Prisma } from '@prisma/client';

export const accountSelect: Prisma.AccountSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  dateOfBirth: true,
};
