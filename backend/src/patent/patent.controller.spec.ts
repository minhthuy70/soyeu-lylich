import { Test, TestingModule } from '@nestjs/testing';
import { PatentController } from './patent.controller';
import { PatentService } from './patent.service';

describe('PatentController', () => {
  let controller: PatentController;
  let service: jest.Mocked<PatentService>;

  const mockPatentService = {
    createPatent: jest.fn(),
    getPatents: jest.fn(),
    getPatentById: jest.fn(),
    updatePatent: jest.fn(),
    deletePatent: jest.fn(),
  };

  const validToken = `h.${Buffer.from(JSON.stringify({ sub: 12 })).toString('base64')}.s`;
  const authReq = {
    headers: {
      authorization: `Bearer ${validToken}`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatentController],
      providers: [
        {
          provide: PatentService,
          useValue: mockPatentService,
        },
      ],
    }).compile();

    controller = module.get<PatentController>(PatentController);
    service = module.get(PatentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPatent', () => {
    it('should create patent with extracted userId', async () => {
      const data = { title: 'New Patent' };
      mockPatentService.createPatent.mockResolvedValue({ id: 1, ...data } as any);

      const result = await controller.createPatent(authReq, data);

      expect(service.createPatent).toHaveBeenCalledWith(12, data);
      expect(result).toEqual({ id: 1, ...data });
    });

    it('should default to userId 1 when authorization header is absent', async () => {
      const data = { title: 'New Patent' };
      await controller.createPatent({ headers: {} }, data);

      expect(service.createPatent).toHaveBeenCalledWith(1, data);
    });
  });

  describe('getPatents', () => {
    it('should get patents for user', async () => {
      mockPatentService.getPatents.mockResolvedValue([]);

      await controller.getPatents(authReq);

      expect(service.getPatents).toHaveBeenCalledWith(12);
    });
  });

  describe('getPatentById', () => {
    it('should get patent by parsed numeric id and userId', async () => {
      mockPatentService.getPatentById.mockResolvedValue({ id: 5 } as any);

      const result = await controller.getPatentById('5', authReq);

      expect(service.getPatentById).toHaveBeenCalledWith(5, 12);
      expect(result).toEqual({ id: 5 });
    });
  });

  describe('updatePatent', () => {
    it('should update patent by id and userId', async () => {
      const updateData = { status: 'ISSUED' };
      mockPatentService.updatePatent.mockResolvedValue({ count: 1 } as any);

      const result = await controller.updatePatent('5', authReq, updateData);

      expect(service.updatePatent).toHaveBeenCalledWith(5, 12, updateData);
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('deletePatent', () => {
    it('should delete patent by id and userId', async () => {
      mockPatentService.deletePatent.mockResolvedValue({ count: 1 } as any);

      const result = await controller.deletePatent('5', authReq);

      expect(service.deletePatent).toHaveBeenCalledWith(5, 12);
      expect(result).toEqual({ count: 1 });
    });
  });
});
