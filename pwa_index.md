pwa-all
实现pwa所需全部: pwa实现 + pwa利用方案

# 使用 
cd ./pwa_demo_webpack/pwa_demo_lavas_dist
python3 -m http.server 8001
open in browser: http://localhost:8001
server关闭: 网页依然能被访问

# pwa实现
1. (主)利用 webpack+workbox 构建出./pwa_demo/pwa_demo_lavas_dist这样的产出
2. (次)演示 pwa的gulp配置


# pwa利用方案(good)_本质:pwa+饿了么PRPL
(个人理解: 理论有了, 实践问题不大 OvO)
- 一.饿了么pwa升级实践4步骤PRPL(Push/Preload、Render、Precache、Lazy-Load)
参见: 饿了么的PWA升级实践 https://zhuanlan.zhihu.com/p/27853228
  - 1.PUSH/PRELOAD，推送/预加载初始URL(可理解为首页)路由所需的关键资源(首页关键资源)。
       - (1)首页html中的`<link rel="preload">` `<script>`以便被浏览器preload扫码器识别应用依赖关系教深处的资源, 进行提前加载
       - (2)server push
       - (3)首页关键资源可从webpack entry依赖资源大致看出
  - 2.RENDER，渲染初始路由，尽快让应用可被交互
       - (1)多页应用不依赖js做路由 而根据page, 因此不需要做什么
       - (2)骨架屏提升白屏期间用户响应, 1>黑魔法setTimeout(() => new Vue(), 0)以便主业务逻辑执行前 骨架屏能顺利绘制
          2>preload骨架屏css以便所有css下载前骨架屏顺利绘制
  - 3.PRE-CACHE，用 Service Worker 预缓存剩下的路由
       - (1) 利用service worker能主动发起请求预取并缓存剩下路由(workbox.precaching.precacheAndRoute()), 只prefetch appshell或者称之"关键路由"或"安装包",
       e.g.在首页precache: order shop profile sales offline等路由资源
       - (2) 自动化方法: 利用gulp或webpack生成prefetch清单, 每次构建时根据prefetch清单生成新的service-worker.js文件,
       新service-worker.js激活时进行prefetch_钩子是install还是activate?
  - 4.LAZY-LOAD 按需懒加载、懒实例化剩下的路由
       - (1)多页应用天生根据page懒加载, 因此不需要做什么
       - (2)webpack打包分包import webpackChunkName
       - (3)预测下一步操作并预加载资源 以便下一步操作迅速响应_加强版ensureLoader
- 二.补充&useful-scripts: 参见./pwa_demo/      

# demo
  ./pwa_demo/

# 涉及知识与库
## service-worker生命周期
  parsed/installing/installed/activating/activated/redundant
  workbox.skipWaiting() 跳过install直接进入activate
## pwa涉及lib:
  depracated sw-precache
  vue-tempaltes/pwa lavas_封装了workbox_对我司工程不适合
  (good) workbox3 workbox-webpack-plugin
## workbox 3.0 blog:
guides: https://developers.google.com/web/tools/workbox/guides/get-started
modules: https://developers.google.com/web/tools/workbox/modules/
