export interface Party {
  _id: string;
  partyDate: string;
  kidName: string;
  kidAge: number;
  locationName: string;
  startTime?: string;
  endTime?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  guestsCount?: number;
  notes?: string;
  kidsCount?: number;
  parentsCount?: number;
  kidsCatering?: string;
  parentsCatering?: string;
  createdAt?: string;
  updatedAt?: string;
}
