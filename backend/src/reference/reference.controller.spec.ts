import { Test, TestingModule } from '@nestjs/testing';
import { ReferenceController } from './reference.controller';
import { ReferenceService } from './reference.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

describe('ReferenceController', () => {
  let controller: ReferenceController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getByCompany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 8 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferenceController],
      providers: [
        {
          provide: ReferenceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReferenceController>(ReferenceController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with user id and dto', async () => {
      const dto = { name: 'Trần B', company: 'Google' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(mockService.create).toHaveBeenCalledWith(8, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should require an authenticated user instead of falling back to another user', () => {
      const dto = { name: 'Trần B' };

      expect(() => controller.create({} as AuthenticatedRequest, dto)).toThrow();
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId', async () => {
      mockService.findAll.mockResolvedValue({ references: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(mockService.findAll).toHaveBeenCalledWith(8);
    });
  });

  describe('getByCompany', () => {
    it('should call service.getByCompany with userId and company query', async () => {
      mockService.getByCompany.mockResolvedValue({ references: [], count: 0 } as any);

      await controller.getByCompany(mockReq, 'Google');

      expect(mockService.getByCompany).toHaveBeenCalledWith(8, 'Google');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 2 } as any);

      const result = await controller.findOne(mockReq, 2);

      expect(mockService.findOne).toHaveBeenCalledWith(8, 2);
      expect(result).toEqual({ id: 2 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { position: 'CTO' };
      mockService.update.mockResolvedValue({ id: 2, ...updateDto } as any);

      const result = await controller.update(mockReq, 2, updateDto);

      expect(mockService.update).toHaveBeenCalledWith(8, 2, updateDto);
      expect(result).toEqual({ id: 2, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, 2);

      expect(mockService.remove).toHaveBeenCalledWith(8, 2);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
