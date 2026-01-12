export type IDoctorFilterRequest = {
  searchTerm?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  specialties?: string | undefined;
};

export type IDoctorUpdate = {
  name: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  appointmentFee: number;  // ✅ Fixed typo
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  specialties: ISpecialties[];
};

export type ISpecialties = {
  specialtyId: string;      // ✅ Matches Prisma schema
  isDeleted?: boolean | null;  // ✅ Better type definition
};
