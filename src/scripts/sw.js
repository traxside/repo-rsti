import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Do precaching
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);

registerRoute(
    ({ url }) => {
      return url.origin === 'https://ui-avatars.com';
    },
    new CacheFirst({
      cacheName: 'avatars-api',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    }),
);

