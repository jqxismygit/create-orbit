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
