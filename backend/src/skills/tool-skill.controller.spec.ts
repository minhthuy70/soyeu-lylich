import { Test, TestingModule } from '@nestjs/testing';
import { ToolSkillController } from './tool-skill.controller';
import { ToolSkillService } from './tool-skill.service';

describe('ToolSkillController', () => {
  let controller: ToolSkillController;
  let service: jest.Mocked<ToolSkillService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 6 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolSkillController],
      providers: [
        {
          provide: ToolSkillService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ToolSkillController>(ToolSkillController);
    service = module.get(ToolSkillService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with user id and dto', async () => {
      const dto = { name: 'Postman', category: 'API Testing' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(6, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should default to userId 1 if req.user is undefined', async () => {
      const dto = { name: 'Figma' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId', async () => {
      mockService.findAll.mockResolvedValue({ skills: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith(6);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 12 } as any);

      const result = await controller.findOne(mockReq, '12');

      expect(service.findOne).toHaveBeenCalledWith(6, 12);
      expect(result).toEqual({ id: 12 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { yearsOfUse: 4 };
      mockService.update.mockResolvedValue({ id: 12, ...updateDto } as any);

      const result = await controller.update(mockReq, '12', updateDto);

      expect(service.update).toHaveBeenCalledWith(6, 12, updateDto);
      expect(result).toEqual({ id: 12, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '12');

      expect(service.remove).toHaveBeenCalledWith(6, 12);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
