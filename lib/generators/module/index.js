const { existsSync } = require('fs');
const childProcess = require('child_process');
const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'gitAddress',
        message: '输入git仓库地址(.eg git@gitlab.sensoro.com:lins/frontend/orbit-graph.git)',
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
      console.log('check git address...');

      function getNameByGitAddress(address) {
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

      const { name, moduleName, packageName } = getNameByGitAddress(props.gitAddress);

      if (existsSync(this.destinationPath(this.perfix, moduleName))) {
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

  default() {
    console.log('add submodule...');
    if (this.prompts.gitAddress) {
      try {
        const path =
          this.perfix.length > 0
            ? `${this.perfix}/${this.prompts.moduleName}`
            : this.prompts.moduleName;
        console.log('path = ', path);
        console.log('cwd = ', this.destinationPath(this.perfix, this.prompts.moduleName));
        console.log('cmd = ', `git submodule add ${this.prompts.gitAddress} ${path}`);
        // childProcess.execSync(`git submodule add ${this.prompts.gitAddress} ${path}`, {
        //   cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
        // });
        this.spawnCommandSync('git', ['submodule', 'add', this.prompts.gitAddress, path]),
          {
            cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
          };
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new Error('创建submodule失败！');
    }
  }

  writing() {
    // this.writeFiles({
    //   context: this.prompts,
    // });
  }

  end() {
    console.log('this.prompts = ', this.prompts);
    console.log('end---->>>');
  }
}

module.exports = Generator;
