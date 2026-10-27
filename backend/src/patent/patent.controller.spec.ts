import { Test, TestingModule } from '@nestjs/testing';
import { PatentController } from './patent.controller';
import { PatentService } from './patent.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

describe('PatentController', () => {
  let controller: PatentController;

  const mockPatentService = {
    createPatent: jest.fn(),
    getPatents: jest.fn(),
    getPatentById: jest.fn(),
    updatePatent: jest.fn(),
    deletePatent: jest.fn(),
  };
  const authenticatedRequest = { user: { id: 12 } } as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatentController],
      providers: [{ provide: PatentService, useValue: mockPatentService }],
    }).compile();

    controller = module.get<PatentController>(PatentController);
    jest.clearAllMocks();
  });

  it('creates patents for the verified user', async () => {
    const patent = { title: 'New Patent' };
    mockPatentService.createPatent.mockResolvedValue({ id: 1, ...patent });

    const result = await controller.createPatent(authenticatedRequest, patent);

    expect(mockPatentService.createPatent).toHaveBeenCalledWith(12, patent);
    expect(result).toEqual({ id: 1, ...patent });
  });

  it('lists patents for the verified user', async () => {
    mockPatentService.getPatents.mockResolvedValue([]);

    await controller.getPatents(authenticatedRequest);

    expect(mockPatentService.getPatents).toHaveBeenCalledWith(12);
  });

  it('uses numeric ids and verified identity for resource operations', async () => {
    const updateData = { status: 'ISSUED' };
    mockPatentService.getPatentById.mockResolvedValue({ id: 5 });
    mockPatentService.updatePatent.mockResolvedValue({ count: 1 });
    mockPatentService.deletePatent.mockResolvedValue({ count: 1 });

    await controller.getPatentById(5, authenticatedRequest);
    await controller.updatePatent(5, authenticatedRequest, updateData);
    await controller.deletePatent(5, authenticatedRequest);

    expect(mockPatentService.getPatentById).toHaveBeenCalledWith(5, 12);
    expect(mockPatentService.updatePatent).toHaveBeenCalledWith(5, 12, updateData);
    expect(mockPatentService.deletePatent).toHaveBeenCalledWith(5, 12);
  });
});
