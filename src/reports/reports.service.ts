import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({
    price,
    model,
    make,
    year,
    lng,
    lat,
    mileage,
  }: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('model= :model', { model })
      .andWhere('make= :make', { make })
      .andWhere('lng= :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat= - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year= - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage= - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }

  create(report: CreateReportDto, user: User) {
    const newReport = this.repo.create(report);
    newReport.user = user;
    return this.repo.save(newReport);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    report.approved = approved;
    return this.repo.save(report);
  }
}
