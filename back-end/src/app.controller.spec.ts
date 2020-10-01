import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { baseURL }  from './config/keys'
import { UrlPair } from './inferfaces/url-pair.interface';
import { CreateUrlDto } from './dto/create-url.dto'


const validUrlTestCases = ['https://pbid.com/', 'http://pbid.com/',
  'pbid.com', 'www.pbid.com', 'subdomain.pbid.com', 'pbid.ie', '123.com',
  'www3.primaryribs.co.zw', 'ww33334w3.pbid.co.zw', 'https://github.com/nestjs/nest/issues/363',
'https://www.google.com/search?q=hilaruous&tbm=isch&ved=2ahUKEwie4eekk4_sAhWZwoUKHQYrA6cQ2-cCegQIA' +
'BAA&oq=hilaruous&gs_lcp=CgNpbWcQAzIECCMQJzIGCAAQChAYMgYIABAKEBgyBggAEAoQGDIGCAAQChAYMgYIABAKEBgyBggA' +
'EAoQGDIGCAAQChAYMgYIABAKEBgyBggAEAoQGFDMCFi5C2DLDGgAcAB4AIABYIgBtQGSAQEymAEAoAEBqgELZ3dzLXdpei1pbWfAAQE' +
'&sclient=img&ei=35FzX971I5mFlwSG1oy4Cg&bih=717&biw=1525&client=firefox-b-d#imgrc=P16xGreQm_yjKM'];

const invalidUrlTestCases = ['https://pbid', 'http://primeribs', 'http://prim$aryschool.com/',
  'pbi-*d.com', '.pbid.com', 'subdomain.pbidpbid/id.com', 'pb!id.ie', 'http://localhost:3000/',
' ', '12345', '/^[a-z0-9]{8}$/'];


const mockUrlRepositoryController = {
  countDocuments: jest.fn(() => {return 2}),
  find: jest.fn(() => {return [{"url" : "www.precious.com/"}, {"url" : "www.scrumptious.com"}]}),
};



describe('AppController', () => {
  let appController: AppController;


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, {
        provide: getModelToken('UrlPair'),
        useValue: mockUrlRepositoryController,
      }],
    }).compile();

    appController = await app.get<AppController>(AppController);
  });


  test('shortenUrl returns value' , () => {
    const testUrlDto: CreateUrlDto = { "url" : "https://www.google.com/fake34543234654743563454747" };
    expect(appController.shortenUrl(testUrlDto)).toBeDefined();
  });


  test('Get All' , async () => {
    const collectionCount: number = await appController.getCount();
    const allUrlPairs: UrlPair[]  = await appController.getAll();
    expect(allUrlPairs.length).toEqual(collectionCount)
  })



});


const mockUrlRepositoryService = {
  countDocuments: jest.fn(() => {return 100000000000}),
  find: jest.fn(() => {return [{"url" : "www.precious.com/"}, {"url" : "www.scrumptious.com"}]}),
};




describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, {
        provide: getModelToken('UrlPair'),
        useValue: mockUrlRepositoryService,
      }],
    }).compile();

    appService = await app.get<AppService>(AppService);
  });

  test('baseURL is https://pbid.io/' , () => {
    const pbid = "https://pbid.io/";
    expect(pbid).toEqual(baseURL)
  });

  describe('Input URLs should be valid', () => {
    validUrlTestCases.forEach(url => {
      it(`Input URL "${url}" is valid`, () => {
        expect(appService.parseUrl(url)).toBeDefined();
      });
    });

    invalidUrlTestCases.forEach(url => {
      it(`Malformed Input URL "${url}" is invalid`, () => {
        expect(appService.parseUrl(url)).toBe(null);
      });
    });
  });



  describe('Short URL should be valid', () => {

    function getBaseCount(count?) {
      if (count){return 100000000000 + count
      } else {
        return 100000000000
      }
    }

    let testPromiseNumber: Promise<number> = new Promise((resolve) => {
      resolve(getBaseCount());
    });

    testPromiseNumber = testPromiseNumber.then(function(count) {
      return count+1
    });



    it('Short URL key should be 8 char lowercase alphanumeric string', async () => {
      const expected =  expect.stringMatching(/^[a-z0-9]{8}$/);
      expect(await appService.createShortUrlKey(testPromiseNumber)).toEqual(expected)
    });

    it('Short URL key should not contain upper case or non-alphanumeric chars', () => {
      const expected =  expect.stringMatching(/^[A-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
      expect(appService.createShortUrlKey()).not.toEqual(expected)
    });


    it('Full short URL should be lower case', async () => {
      const shortUrl: string = await appService.createShortUrl();
      expect(shortUrl === shortUrl.toLowerCase()).toBeTruthy()
    });


    test('Full short Url contains baseURL and key' , async () => {
      const shortUrl: string = await appService.createShortUrl();
      expect(shortUrl).toMatch(/^(https:\/\/pbid\.io\/)([a-z0-9]{8})/)
    });


    test('Short Url Key is Unique' , async () => {
      const testKeys: Array<string> = [];

      while(testKeys.length<10){
        testKeys.push(await appService.createShortUrlKey(new Promise((resolve) => {
          resolve(getBaseCount(testKeys.length));
        })))
      }

      expect(testKeys.length).toEqual(Array.from(new Set(testKeys)).length)
    });


    test('Short Url Key is Not Duplicated' , async () => {
      // append several keys to list and they should all be diffrenet
      const testKeys: Array<string> = [];

      while(testKeys.length<10){
        testKeys.push(await appService.createShortUrlKey(new Promise((resolve) => {
          resolve(100000000000);
        })))
      }

      expect(testKeys.length).not.toEqual(Array.from(new Set(testKeys)).length)
    })

  });

});
