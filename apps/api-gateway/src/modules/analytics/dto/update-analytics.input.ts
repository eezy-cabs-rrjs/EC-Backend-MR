import { CreateAnalyticsInput } from './create-analytics.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAnalyticsInput extends PartialType(CreateAnalyticsInput) {
  id: number;
}
