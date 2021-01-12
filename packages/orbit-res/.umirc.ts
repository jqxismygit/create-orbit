import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  routes: [{ path: '/', component: '@/pages/index' }],
  base: '/res',
  publicPath: '/res/',
  devtool: false,
  dynamicImport: {},
  qiankun: {
    slave: {},
  }
});
