import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlPairSchema} from './schema/url-pair.schema'
import { mongoURI }  from './config/keys'

@Module({
  imports: [ MongooseModule.forRoot(mongoURI), MongooseModule.forFeature([{name: 'UrlPair', schema: UrlPairSchema}])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
