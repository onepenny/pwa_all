importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

// 开启debug
workbox.setConfig({ debug: true });

workbox.precaching.precacheAndRoute([
  {
    "url": "imgs/HM-1.png",
    "revision": "98d1a66a666688af9f34c46437008ade"
  },
  {
    "url": "imgs/HM-2.png",
    "revision": "eb46ddd201ee3fb5e1bb1de7d1632f5b"
  },
  {
    "url": "index.html",
    "revision": "62caeab9c24ee7cf39297c4762fcef90"
  },
  {
    "url": "libs/jquery-3.2.1.min.js",
    "revision": "c9f5aeeca3ad37bf2aa006139b935f0a"
  },
  {
    "url": "pages/aboutus.html",
    "revision": "1bd0eef5e0e1a30063fe89ba68860f24"
  },
  {
    "url": "scripts/index.js",
    "revision": "aefeb4d6c033a0e082b1ef512d9c7182"
  },
  {
    "url": "styles/aboutus.css",
    "revision": "489c1b479a8bbb912d53a1b949b93001"
  },
  {
    "url": "styles/index.css",
    "revision": "9707c6dcc441f4704f5ede55bf2f7d55"
  }
]);

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉` );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
console.log('sase', self == this)

// 1 start
// // 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

// 主文档: 网络优先
// workbox.routing.registerRoute(
//     /.*\.html/,
//     workbox.strategies.networkFirst({
//         cacheName: 'workbox:html',
//     })
// );
//
// // JS 请求: 网络优先
// workbox.routing.registerRoute(
//     new RegExp(".*.js"),
//     workbox.strategies.networkFirst({
//         cacheName: "workbox:js"
//     })
// );
// // CSS 请求: 缓存优先，同时后台更新后下次打开页面才会被页面使用 staleWhileRevalidate
// workbox.routing.registerRoute(
//     // Cache CSS files
//     /.*\.css/,
//     // Use cache but update in the background ASAP
//     workbox.strategies.staleWhileRevalidate({
//         // Use a custom cache name
//         cacheName: "workbox:css"
//     })
// );
//
// // 图片请求: 缓存优先
// workbox.routing.registerRoute(
//     // Cache image files
//     /.*\.(?:png|jpg|jpeg|svg|gif)/,
//     // Use the cache if it's available
//     workbox.strategies.cacheFirst({
//         // Use a custom cache name
//         cacheName: "workbox:image",
//         plugins: [
//             new workbox.expiration.Plugin({
//                 // Cache only 20 images
//                 maxEntries: 20,
//                 // Cache for a maximum of a week
//                 maxAgeSeconds: 7 * 24 * 60 * 60
//             })
//         ]
//     })
// );

// 2 start
const CACHE_VERSION = 'test-cache-v3';
// // 监听 service worker 的 install 事件
this.addEventListener('install', function (event) {
    console.log('install_trigger')
    // 如果监听到了 service worker 已经安装成功的话，就会调用 event.waitUntil 回调函数
    // event.waitUntil(
    //     // 安装成功后操作 CacheStorage 缓存，使用之前需要先通过 caches.open() 打开对应缓存空间。
    //     caches.open(CACHE_VERSION).then(function (cache) {
    //         // 通过 cache 缓存对象的 addAll 方法添加 precache 缓存
    //         return cache.addAll([
    //             '/',
    //             '/index.html',
    //             '/index.css',
    //             '/index.js',
    //             '/img.png'
    //         ]);
    //     })
    // );
});

this.addEventListener('fetch', function (event) {
    console.log('fetch_trigger')
    //接着调用 event 上的 respondWith() 方法来劫持我们的 HTTP 响应，然后自由更新他们
    event.respondWith(
        // caches.match(event.request) 允许我们对网络请求的资源和 cache 里可获取的资源进行匹配，查看是否缓存中有相应的资源
        caches.match(event.request).then(function (response) {

            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {

                // http请求的返回已被抓到，可以处置了。

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }

                // 请求成功的话，将请求缓存起来。
                var responseClone = httpRes.clone();
                caches.open(CACHE_VERSION).then(function (cache) {
                    cache.put(event.request, responseClone);
                });

                return httpRes;
            });
        })
    );
});

// // 安装阶段跳过等待，直接进入 active  开发环境
// self.addEventListener('install', function (event) {
//     event.waitUntil(self.skipWaiting());
// });

self.addEventListener('activate', function (event) {
    console.log('activate_trigger')
    event.waitUntil(
        Promise.all([

            // 更新客户端
            self.clients.claim(),

            // 清理旧版本
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== CACHE_VERSION) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});
