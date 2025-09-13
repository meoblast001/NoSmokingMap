const SmokingStatusValues = ['no', 'yes', 'dedicated', 'separated', 'isolated', 'outside'] as const;
export type SmokingStatus = typeof SmokingStatusValues[number];

export function isSmokingStatus(x: any): x is SmokingStatus {
  return SmokingStatusValues.includes(x);
}
