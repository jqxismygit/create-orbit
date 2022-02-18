const childProcess = require('child_process');
const fs = require('fs');
const { join } = require('path');

const cwd = process.cwd();
const ignoreList = ['@sensoro/core', '@sensoro/layout', '@sensoro/library'];
const packagePath = join(cwd, 'package.json');
const packageProdPath = join(cwd, 'package.prod.json');

if (!fs.lstatSync(packagePath).isFile()) {
  throw new Error('package.json 文件不存在!');
}

if (!fs.lstatSync(packageProdPath).isFile()) {
  console.log(
    'package.prod.json 文件不存在! 可能更新脚本出现了错误，请联系king解决!',
  );
}

const packageContent = require(packagePath);
const packageProdContent = require(packageProdPath);

function supportDynamicImport() {
  return (
    packageContent &&
    packageContent.devDependencies &&
    packageContent.devDependencies['umi-plugin-qiankun-dynamic-module']
  );
}
if (!supportDynamicImport()) {
  ignoreList.length = 0;
}

function diffDependencies(sDependencies, tDependencies) {
  if (!!sDependencies && !!tDependencies) {
    return (
      Object.keys(sDependencies).some(
        (k) =>
          ignoreList.indexOf(k) === -1 &&
          (!tDependencies[k] || tDependencies[k] !== sDependencies[k]),
      ) ||
      Object.keys(tDependencies).some(
        (k) =>
          ignoreList.indexOf(k) === -1 &&
          (!sDependencies[k] || tDependencies[k] !== sDependencies[k]),
      )
    );
  }
  return true;
}
function commit() {
  try {
    console.log('commit update');
    childProcess.execSync(
      `git commit -am "chore: auto update package.prod.json"`,
    );
  } catch (e) {
    console.error('自动提交失败，请手动提交');
  }
}
if (
  diffDependencies(
    packageContent.dependencies,
    packageProdContent.dependencies,
  ) ||
  diffDependencies(
    packageContent.devDependencies,
    packageProdContent.devDependencies,
  )
) {
  console.log('检测到package.json的依赖有更新，自动同步到package.prod.json');
  fs.writeFileSync(packageProdPath, JSON.stringify(packageContent, null, 2));
  commit();
}
