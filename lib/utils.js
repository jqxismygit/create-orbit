function getNameByRepository(address) {
  if (typeof address === 'string') {
    const splitAddress = address.split('/');
    const moduleName =
      splitAddress && splitAddress.length > 0 ? splitAddress[splitAddress.length - 1] : null;
    if (moduleName && moduleName.startsWith('orbit-') && moduleName.endsWith('.git')) {
      const realModuleName = moduleName.replace('.git', '');
      const name = realModuleName.replace('orbit-', '');
      return {
        name,
        moduleName: realModuleName,
        packageName: `@sensoro/${name}`,
      };
    } else {
      throw new Error('git地址不合法!, 仓库名称必须以orbit-开头, .eg orbit-graph');
    }
  } else {
    throw new Error('git地址不合法!');
  }
}

module.exports = {
  getNameByRepository,
};
