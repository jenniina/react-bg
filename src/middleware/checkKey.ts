import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const checkKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key']
  if (key === process.env.KEY) {
    next()
  } else {
    res.status(403).json({
      success: false,
      message: 'Wrong key',
    })
  }
}

export default checkKey
