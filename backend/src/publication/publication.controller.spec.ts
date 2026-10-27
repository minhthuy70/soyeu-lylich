import { Test, TestingModule } from '@nestjs/testing';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';

describe('PublicationController', () => {
  let controller: PublicationController;
  let service: jest.Mocked<PublicationService>;

  const mockPublicationService = {
    createPublication: jest.fn(),
    getPublications: jest.fn(),
    getPublicationById: jest.fn(),
    updatePublication: jest.fn(),
    deletePublication: jest.fn(),
  };

  const validToken = `h.${Buffer.from(JSON.stringify({ sub: 15 })).toString('base64')}.s`;
  const authReq = {
    headers: {
      authorization: `Bearer ${validToken}`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationController],
      providers: [
        {
          provide: PublicationService,
          useValue: mockPublicationService,
        },
      ],
    }).compile();

    controller = module.get<PublicationController>(PublicationController);
    service = module.get(PublicationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPublication', () => {
    it('should create publication with decoded userId', async () => {
      const data = { title: 'A New Method in Deep Learning' };
      mockPublicationService.createPublication.mockResolvedValue({ id: 1, ...data } as any);

      const result = await controller.createPublication(authReq, data);

      expect(service.createPublication).toHaveBeenCalledWith(15, data);
      expect(result).toEqual({ id: 1, ...data });
    });

    it('should default to userId 1 if authorization header is missing', async () => {
      const data = { title: 'AI Paper' };
      await controller.createPublication({ headers: {} }, data);

      expect(service.createPublication).toHaveBeenCalledWith(1, data);
    });
  });

  describe('getPublications', () => {
    it('should get publications for user', async () => {
      mockPublicationService.getPublications.mockResolvedValue([]);

      await controller.getPublications(authReq);

      expect(service.getPublications).toHaveBeenCalledWith(15);
    });
  });

  describe('getPublicationById', () => {
    it('should call getPublicationById with parsed id and userId', async () => {
      mockPublicationService.getPublicationById.mockResolvedValue({ id: 9 } as any);

      const result = await controller.getPublicationById('9', authReq);

      expect(service.getPublicationById).toHaveBeenCalledWith(9, 15);
      expect(result).toEqual({ id: 9 });
    });
  });

  describe('updatePublication', () => {
    it('should update publication by id and userId', async () => {
      const updateData = { journal: 'Nature Machine Intelligence' };
      mockPublicationService.updatePublication.mockResolvedValue({ count: 1 } as any);

      const result = await controller.updatePublication('9', authReq, updateData);

      expect(service.updatePublication).toHaveBeenCalledWith(9, 15, updateData);
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('deletePublication', () => {
    it('should delete publication by id and userId', async () => {
      mockPublicationService.deletePublication.mockResolvedValue({ count: 1 } as any);

      const result = await controller.deletePublication('9', authReq);

      expect(service.deletePublication).toHaveBeenCalledWith(9, 15);
      expect(result).toEqual({ count: 1 });
    });
  });
});
