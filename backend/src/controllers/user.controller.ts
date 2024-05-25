import { SharedService } from '@/services/shared_data.service';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import youtubeDl, { Payload } from 'youtube-dl-exec';

export class UserController {
  public user = Container.get(SharedService);

  public handleShare = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.body;
      console.log(url);
      const resp: Payload = await youtubeDl(url, {
        dumpSingleJson: true,
        noWarnings: true,
        skipDownload: true,
        includeAds: false,
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
        writeAnnotations: false,
        writeAutoSub: false,
        writeDescription: false,
        writeInfoJson: false,
        writeSub: false,
        embedSubs: false,
        listFormats: false,
      });
      res.status(201).json({
        data: {
          title: resp.title,
          urlThumb: resp.thumbnail,
          desc: resp.description,
          duration: resp?.duration,
          viewCount: resp?.view_count,
          channel: resp.channel,
          channelUrl: resp.channel_url,
          channelFollow: resp?.channel_follower_count,
        },
      });
      //   res.status(201).json({ data: signUpUserData, message: 'signup success' });
    } catch (error) {
      next(error);
    }
  };
}
