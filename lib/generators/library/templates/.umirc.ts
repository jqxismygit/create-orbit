import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  routes: [{ path: '/', component: '@/pages/index' }],
  base: '/tpl',
  publicPath: '/tpl/',
  devtool: false,
  dynamicImport: {},
  qiankun: {
    slave: {},
  },
  qiankunDev: {
    devExternal: false,
  },
});
