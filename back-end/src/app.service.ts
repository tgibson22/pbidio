import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { baseURL }  from './config/keys'
import { CreateUrlDto } from './dto/create-url.dto'
import { UrlPair } from './inferfaces/url-pair.interface';


@Injectable()
export class AppService {
  private readonly baseNumber: number = 100000000000;
  private count: number;

  constructor(@InjectModel('UrlPair') private readonly UrlPairModel: Model<UrlPair> ) {
    this.init();
  }

  private async init():  Promise<boolean> {
    await this.setInitialCount(this.baseNumber);
    if (this.count){
      return true
    }
  }

   async getCount(): Promise<number> {
     const urlCount = await this.UrlPairModel.countDocuments();
     return urlCount;
   }

   async setInitialCount(baseNum:number): Promise<number> {
    const urlCount: number = await this.getCount();
    return  this.count = baseNum + urlCount
  }

  incrementCount(): number{
     return this.count++;
  }

  async getAll(): Promise<UrlPair[]>{
    return this.UrlPairModel.find();
  }

  async shortenUrl(urlJson: CreateUrlDto): Promise<UrlPair> {
    const url: string = urlJson.url;
    const parsedUrl: string | null = await this.parseUrl(url);


    if (parsedUrl) {
      const shortUrl: string = await this.createShortUrl();
      const result: {fullUrl: string, shortUrl: string} = {
        fullUrl: JSON.stringify(parsedUrl),
        shortUrl: shortUrl
      };


      const newUrl: UrlPair  = new this.UrlPairModel(result);

      return await newUrl.save();

    } else {
      //handle
      return null
    }



  }

  parseUrl(url): string | null {
    // basic validation, removing partial matches
    let match: string = url.toString().match(new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/));
    if (match) {
      match = match.toString().slice(0, url.length);
      if (match[0] !== '.') {
        return (match === url) ?
          url : null;
      } else {
        return null
      }
    } else {
      // handle error
      return null
    }

  }

  async createShortUrl() : Promise<string> {
    const key: string = await this.createShortUrlKey();
    const shortUrl: string = baseURL + key;
    return shortUrl
  }


  async createShortUrlKey(count: Promise<number> =  this.getCount()): Promise<string> {
    await this.incrementCount();
    return (await this.count).toString(36);

  }


}
