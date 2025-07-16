import axios from 'axios';

import { Request, Response } from 'express';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}

export { getAllUsers };
