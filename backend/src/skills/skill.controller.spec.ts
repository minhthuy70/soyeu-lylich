import { Test, TestingModule } from '@nestjs/testing';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';

describe('SkillController', () => {
  let controller: SkillController;
  let service: jest.Mocked<SkillService>;

  const mockSkillService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    incrementEndorsement: jest.fn(),
  };

  const mockReq = { user: { id: 3 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillController],
      providers: [
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
      ],
    }).compile();

    controller = module.get<SkillController>(SkillController);
    service = module.get(SkillService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create skill with user id from req and dto', async () => {
      const dto = { name: 'Node.js', progress: 85 };
      mockSkillService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(3, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should default to userId 1 if req.user is undefined', async () => {
      const dto = { name: 'React' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should return all skills for the user', async () => {
      mockSkillService.findAll.mockResolvedValue({ skills: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith(3);
    });
  });

  describe('findOne', () => {
    it('should return single skill by id', async () => {
      mockSkillService.findOne.mockResolvedValue({ id: 5, name: 'Docker' } as any);

      const result = await controller.findOne(mockReq, '5');

      expect(service.findOne).toHaveBeenCalledWith(3, 5);
      expect(result).toEqual({ id: 5, name: 'Docker' });
    });
  });

  describe('update', () => {
    it('should update skill by id', async () => {
      const dto = { progress: 95 };
      mockSkillService.update.mockResolvedValue({ id: 5, ...dto } as any);

      const result = await controller.update(mockReq, '5', dto);

      expect(service.update).toHaveBeenCalledWith(3, 5, dto);
      expect(result).toEqual({ id: 5, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove skill by id', async () => {
      mockSkillService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '5');

      expect(service.remove).toHaveBeenCalledWith(3, 5);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('endorse', () => {
    it('should call incrementEndorsement with userId and parsed id', async () => {
      mockSkillService.incrementEndorsement.mockResolvedValue({ id: 5, endorsementCount: 1 } as any);

      const result = await controller.endorse(mockReq, '5');

      expect(service.incrementEndorsement).toHaveBeenCalledWith(3, 5);
      expect(result).toEqual({ id: 5, endorsementCount: 1 });
    });
  });
});
