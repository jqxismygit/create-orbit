const { existsSync, readFileSync } = require('fs');
const BasicGenerator = require('../../BasicGenerator');
const { getNameByRepository } = require('../../utils');
const { statSync } = require('fs');
class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'repository',
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

      const { name, moduleName, packageName } = getNameByRepository(props.repository);

      let gitModules = [];
      try {
        const gitModulesContent = readFileSync(this.destinationPath('.gitmodules'), {
          encoding: 'utf-8',
        });
        gitModules =
          typeof gitModulesContent === 'string' &&
          gitModulesContent
            .split('\n')
            .filter((i) => i.startsWith('[') && i.endsWith(']'))
            .map((i) => i.split('/')[1].replace('"]', ''));
      } catch (e) {
        throw new Error('解析.gitmodules失败!');
      }
      if (
        existsSync(this.destinationPath(this.perfix, moduleName)) ||
        gitModules.indexOf(moduleName) > -1
      ) {
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
    console.log('link submodule...');
    const path =
      this.perfix.length > 0
        ? `${this.perfix}/${this.prompts.moduleName}`
        : this.prompts.moduleName;
    console.log('path = ', path);
    console.log('cwd = ', this.destinationPath(this.perfix, this.prompts.moduleName));
    this.spawnCommandSync('git', ['clone', this.prompts.repository, path]),
      {
        cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
      };
  }

  writing() {
    this.writeFiles({
      context: this.prompts,
    });
  }

  end() {
    console.log('this.prompts = ', this.prompts);
    console.log('end---->>>');

    // const path =
    //   this.perfix.length > 0
    //     ? `${this.perfix}/${this.prompts.moduleName}`
    //     : this.prompts.moduleName;
    // console.log('path = ', path);
    // console.log('cwd = ', this.destinationPath(this.perfix, this.prompts.moduleName));

    // this.spawnCommandSync('git', ['clone']),
    //   {
    //     cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    //   };
    // this.spawnCommandSync('git', ['remote', 'add', 'origin', this.prompts.repository]),
    //   {
    //     cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    //   };

    // this.spawnCommandSync('git', ['add', '.']),
    //   {
    //     cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    //   };

    // this.spawnCommandSync('git', ['commit', '-am', 'feat: init']),
    //   {
    //     cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    //   };

    // this.spawnCommandSync('git', ['checkout', '-b', 'dev1']),
    //   {
    //     cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    //   };
  }
}

module.exports = Generator;
