import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsInput } from './dto/create-analytics.input';
import { UpdateAnalyticsInput } from './dto/update-analytics.input';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Mutation('createAnalytics')
  create(@Args('createAnalyticsInput') createAnalyticsInput: CreateAnalyticsInput) {
    return this.analyticsService.create(createAnalyticsInput);
  }

  @Query('analytics')
  findAll() {
    return this.analyticsService.findAll();
  }

  @Query('analytics')
  findOne(@Args('id') id: number) {
    return this.analyticsService.findOne(id);
  }

  @Mutation('updateAnalytics')
  update(@Args('updateAnalyticsInput') updateAnalyticsInput: UpdateAnalyticsInput) {
    return this.analyticsService.update(updateAnalyticsInput.id, updateAnalyticsInput);
  }

  @Mutation('removeAnalytics')
  remove(@Args('id') id: number) {
    return this.analyticsService.remove(id);
  }
}
