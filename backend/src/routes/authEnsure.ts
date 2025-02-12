import { Request, Response, NextFunction } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';

 

interface CustomRequest extends Request {

  user: string | JwtPayload; // Add a user property to the request type

}

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const auth = req.headers['authorization'];

  if (!auth) {

    res.status(403).json({ message: 'Unauthorized JWT' });

    return;

  }

  try {

    const decoded = jwt.verify(auth, process.env.JWT_SECRET as string);

    req.user = decoded; 

    next();

  } catch (err) {

    res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });

  }

};

 

export default ensureAuthenticated;