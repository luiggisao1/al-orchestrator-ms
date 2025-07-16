import { Request, Response } from 'express';
import { getAllUsers } from '../src/controllers/dummyController';

describe('getAllUsers', () => {
  it('should return a list of users', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('should handle errors and return a 500 status', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(require('axios'), 'get').mockRejectedValue(new Error('Network Error'));

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching users', error: expect.any(Error) });
  });
});
