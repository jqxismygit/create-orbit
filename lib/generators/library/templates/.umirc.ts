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
  <% if (features.includes('sensoro-design')) { -%>
    extraBabelPlugins: [
      [
        'import',
        {
          libraryName: '@sensoro/sensoro-design',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    ],
<% } -%>
});
