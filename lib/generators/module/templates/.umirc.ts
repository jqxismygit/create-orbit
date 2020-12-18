import { defineConfig } from 'umi';
import { join } from 'path';

export default defineConfig({
  routes: [{ path: '/', component: '@/pages/index' }],
  base: '/<%= name %>',
  publicPath: '/<%= name %>/',
  devtool: false,
  dynamicImport: {},
  qiankun: {
    slave: {},
  }
});
