import { Request } from 'express';

interface RequestWithOauthCode extends Request {
  code: string;
}

export default RequestWithOauthCode;
