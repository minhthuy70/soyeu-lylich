import { Test, TestingModule } from '@nestjs/testing';
import { SoftSkillController } from './soft-skill.controller';
import { SoftSkillService } from './soft-skill.service';

describe('SoftSkillController', () => {
  let controller: SoftSkillController;
  let service: jest.Mocked<SoftSkillService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 4 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoftSkillController],
      providers: [
        {
          provide: SoftSkillService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SoftSkillController>(SoftSkillController);
    service = module.get(SoftSkillService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with user id and dto', async () => {
      const dto = { name: 'Time Management', level: 'High' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(4, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should fallback to userId 1 if req.user is undefined', async () => {
      const dto = { name: 'Critical Thinking' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId', async () => {
      mockService.findAll.mockResolvedValue({ skills: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith(4);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 8 } as any);

      const result = await controller.findOne(mockReq, '8');

      expect(service.findOne).toHaveBeenCalledWith(4, 8);
      expect(result).toEqual({ id: 8 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { progress: 90 };
      mockService.update.mockResolvedValue({ id: 8, ...updateDto } as any);

      const result = await controller.update(mockReq, '8', updateDto);

      expect(service.update).toHaveBeenCalledWith(4, 8, updateDto);
      expect(result).toEqual({ id: 8, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '8');

      expect(service.remove).toHaveBeenCalledWith(4, 8);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
