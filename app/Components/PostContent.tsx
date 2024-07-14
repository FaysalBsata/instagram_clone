import { useWindowDimensions } from 'react-native';
import React from 'react';
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from '@/lib/cloudinary';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';
import { ResizeMode, Video } from 'expo-av';
type PostContentProps = {
  post: any;
  isVisible?: boolean;
};

const PostContent = ({ post, isVisible }: PostContentProps) => {
  const { width } = useWindowDimensions();
  if (post.media_type === 'image') {
    const image = cld.image(post.image);
    image.resize(thumbnail().width(width).height(width));
    return (
      <AdvancedImage
        cldImg={image}
        style={{ width: '100%', aspectRatio: 4 / 3 }}
      />
    );
  }
  if (post.media_type === 'video') {
    const video = cld.video(post.image);
    video.resize(scale().width(400));
    return (
      <Video
        style={{ width: '100%', aspectRatio: 4 / 3 }}
        source={{
          uri: video.toURL(),
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isVisible}
        isMuted={!isVisible}
        isLooping
      />
    );
  }
};

export default PostContent;
