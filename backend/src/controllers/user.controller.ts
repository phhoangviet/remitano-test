import { RequestWithUser } from '@/interfaces/auth.interface';
import { SharedData } from '@/interfaces/shared_data.interface';
import { SharedService } from '@/services/shared_data.service';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import ytdl from 'ytdl-core';

export class UserController {
  public user = Container.get(SharedService);

  public handleShare = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { user } = req;
      const { url } = req.body;
      const resp = await ytdl.getBasicInfo(url);
      if (resp.videoDetails) {
        const respData: SharedData = await this.user.createData({
          user: user,
          title: resp.videoDetails.title,
          url: resp.videoDetails.video_url,
          content: resp.videoDetails.description,
        });
        res.status(201).json({ data: respData });
      }

      // res.status(201).json({
      //   data: {
      //     title: resp?.title,
      //     urlThumb: resp?.thumbnail,
      //     desc: resp?.description,
      //     duration: resp?.duration,
      //     viewCount: resp?.view_count,
      //     channel: resp?.channel,
      //     channelUrl: resp?.channel_url,
      //     channelFollow: resp?.channel_follower_count,
      //   },
      // });
      //   res.status(201).json({ data: signUpUserData, message: 'signup success' });
    } catch (error) {
      next(error);
    }
  };
}
