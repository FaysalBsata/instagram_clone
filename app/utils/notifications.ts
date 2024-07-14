import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export async function sendLikeNotification(like: any) {
  const { data } = await supabase
    .from('likes')
    .select('*, posts(*, profiles(*))')
    .eq('id', like.id)
    .single();
  const pushToken = data?.posts?.profiles?.push_token;
  const { data: userData, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', like?.user_id)
    .single();
  if (!pushToken) return;
  sendPushNotification(pushToken, userData?.username);
}

async function sendPushNotification(expoPushToken: string, userName: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: userName || 'User',
    body: 'Liked your post',
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
