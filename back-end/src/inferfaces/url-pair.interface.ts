import {Document} from 'mongoose';

export interface UrlPair extends  Document{
  fullUrl: string;
  shortUrl: string;
}
