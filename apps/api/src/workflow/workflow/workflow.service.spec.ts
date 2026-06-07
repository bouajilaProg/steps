import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { DB_PROVIDER } from '../../database/database.module';
import { StorageService } from '../../storage/storage.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  const storageServiceMock = {
    deleteFiles: jest.fn().mockResolvedValue(undefined),
  } as unknown as StorageService;

  const dbMock = {} as never;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        { provide: DB_PROVIDER, useValue: dbMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
