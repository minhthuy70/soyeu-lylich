import { Test, TestingModule } from '@nestjs/testing';
import { LanguageSkillController } from './language-skill.controller';
import { LanguageSkillService } from './language-skill.service';

describe('LanguageSkillController', () => {
  let controller: LanguageSkillController;
  let service: jest.Mocked<LanguageSkillService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 2 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageSkillController],
      providers: [
        {
          provide: LanguageSkillService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LanguageSkillController>(LanguageSkillController);
    service = module.get(LanguageSkillService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with user id and dto', async () => {
      const dto = { language: 'Japanese', proficiencyLevel: 'N2' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(2, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should fallback to userId 1 if req.user is missing', async () => {
      const dto = { language: 'Japanese' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId', async () => {
      mockService.findAll.mockResolvedValue({ skills: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith(2);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 4 } as any);

      const result = await controller.findOne(mockReq, '4');

      expect(service.findOne).toHaveBeenCalledWith(2, 4);
      expect(result).toEqual({ id: 4 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { proficiencyLevel: 'N1' };
      mockService.update.mockResolvedValue({ id: 4, ...updateDto } as any);

      const result = await controller.update(mockReq, '4', updateDto);

      expect(service.update).toHaveBeenCalledWith(2, 4, updateDto);
      expect(result).toEqual({ id: 4, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '4');

      expect(service.remove).toHaveBeenCalledWith(2, 4);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
