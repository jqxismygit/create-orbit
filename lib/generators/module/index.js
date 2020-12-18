const { existsSync } = require('fs');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'name',
        message: `请输入模块名称?(.eg graph， 这样会自动在当前目录创建 orbit-graph模块，包名为@sensoro/graph)`,
      },
      {
        name: 'useCore',
        type: 'confirm',
        message: '是否需要使用 @sensoro/core ?',
        default: true,
      },
      {
        name: 'corePreset',
        type: 'confirm',
        message: '是否启用core的预设服务(.eg auth, socket等功能 ?',
        default: true,
      },
      {
        name: 'modulePort',
        message: '输入模块端口号',
        default: 7000,
      },
    ];
    return this.prompt(prompts).then((props) => {
      const name = props.name.startsWith('orbit-') ? props.name.replace('orbit-', '') : props.name;
      const moduleName = `orbit-${name}`;
      const packageName = `@sensoro/${name}`;

      if (existsSync(this.destinationPath(moduleName))) {
        throw new Error('该模块已存在');
      }
      this.prompts = {
        ...props,
        name, //模块名称
        moduleName, //模块名称(包含前缀)
        packageName, //包名
      };
    });
  }

  writing() {
    this.writeFiles({
      context: this.prompts,
    });
  }
}

module.exports = Generator;
