import { Injectable } from '@nestjs/common';
import { CreateAnalyticsInput } from './dto/create-analytics.input';
import { UpdateAnalyticsInput } from './dto/update-analytics.input';

@Injectable()
export class AnalyticsService {
  create(createAnalyticsInput: CreateAnalyticsInput) {
    return 'This action adds a new analytics';
  }

  findAll() {
    return `This action returns all analytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsInput: UpdateAnalyticsInput) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }
}
