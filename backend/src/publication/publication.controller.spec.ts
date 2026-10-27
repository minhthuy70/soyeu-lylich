import { Test, TestingModule } from '@nestjs/testing';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

describe('PublicationController', () => {
  let controller: PublicationController;

  const mockPublicationService = {
    createPublication: jest.fn(),
    getPublications: jest.fn(),
    getPublicationById: jest.fn(),
    updatePublication: jest.fn(),
    deletePublication: jest.fn(),
  };
  const authenticatedRequest = { user: { id: 15 } } as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationController],
      providers: [{ provide: PublicationService, useValue: mockPublicationService }],
    }).compile();

    controller = module.get<PublicationController>(PublicationController);
    jest.clearAllMocks();
  });

  it('creates publications for the verified user', async () => {
    const publication = { title: 'A New Method in Deep Learning' };
    mockPublicationService.createPublication.mockResolvedValue({ id: 1, ...publication });

    const result = await controller.createPublication(authenticatedRequest, publication);

    expect(mockPublicationService.createPublication).toHaveBeenCalledWith(15, publication);
    expect(result).toEqual({ id: 1, ...publication });
  });

  it('lists publications for the verified user', async () => {
    mockPublicationService.getPublications.mockResolvedValue([]);

    await controller.getPublications(authenticatedRequest);

    expect(mockPublicationService.getPublications).toHaveBeenCalledWith(15);
  });

  it('uses numeric ids and verified identity for resource operations', async () => {
    const updateData = { journal: 'Nature Machine Intelligence' };
    mockPublicationService.getPublicationById.mockResolvedValue({ id: 9 });
    mockPublicationService.updatePublication.mockResolvedValue({ count: 1 });
    mockPublicationService.deletePublication.mockResolvedValue({ count: 1 });

    await controller.getPublicationById(9, authenticatedRequest);
    await controller.updatePublication(9, authenticatedRequest, updateData);
    await controller.deletePublication(9, authenticatedRequest);

    expect(mockPublicationService.getPublicationById).toHaveBeenCalledWith(9, 15);
    expect(mockPublicationService.updatePublication).toHaveBeenCalledWith(9, 15, updateData);
    expect(mockPublicationService.deletePublication).toHaveBeenCalledWith(9, 15);
  });
});
