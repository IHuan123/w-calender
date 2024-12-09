module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    //使用的额外的语言特性
    ecmaFeatures: {
      jsx: true, //启用JSX
      globalReturn: true, //允许在全局作用域下使用 return 语句
      impliedStrict: true, //启用全局 strict mode （如果 ecmaVersion 是5或更高）
      experimentalObjectRestSpread: true, //启用实验性的 object rest/spread properties 支持。（重要：这是一个实验性的功能，在未来可能会有明显改变。建议你写的规则不要依赖该功能，除非当它发生改变时你愿意承担维护成本。）
    },
  },
  plugins: ['vue', 'jsx'],
  rules: {
    semi: 0, // 禁止尾部使用分号
    'no-console': 2, // 禁止出现console
    'no-debugger': 2, // 禁止出现debugger
    'no-duplicate-case': 'warn', // 禁止出现重复case
    'no-empty': 'error', // 禁止出现空语句块
    'no-extra-parens': 'off', // 禁止不必要的括号
    'no-func-assign': 'warn', // 禁止对Function声明重新赋值
    'no-unreachable': 'off', // 禁止出现[return|throw]之后的代码块
    'no-else-return': 'warn', // 禁止if语句中return语句之后有else块
    'no-empty-function': 'warn', // 禁止出现空的函数块
    'no-lone-blocks': 'warn', // 禁用不必要的嵌套块
    'no-multi-spaces': 'warn', // 禁止使用多个空格
    'no-redeclare': 'off', // 禁止多次声明同一变量
    'no-return-assign': 'warn', // 禁止在return语句中使用赋值语句
    'no-return-await': 'warn', // 禁用不必要的[return/await]
    'no-self-compare': 'warn', // 禁止自身比较表达式
    'no-useless-catch': 'warn', // 禁止不必要的catch子句
    'no-useless-return': 'warn', // 禁止不必要的return语句
    'no-mixed-spaces-and-tabs': 'off', // 禁止空格和tab的混合缩进
    'no-multiple-empty-lines': 'warn', // 禁止出现多行空行
    'no-trailing-spaces': 'warn', // 禁止一行结束后面不要有空格
    'no-useless-call': 'warn', // 禁止不必要的.call()和.apply()
    'no-var': 'warn', // 禁止出现var用let和const代替
    'no-delete-var': 'off', // 允许出现delete变量的使用
    'no-shadow': 'off', // 允许变量声明与外层作用域的变量同名
    'no-unused-vars': 2, // 未使用变量
    'dot-notation': 'off', // 要求尽可能地使用点号
    'default-case': 'warn', // 要求switch语句中有default分支
    eqeqeq: 'warn', // 要求使用 === 和 !==
    curly: 'off', // 要求所有控制语句使用一致的括号风格
    'space-before-blocks': 'warn', // 要求在块之前使用一致的空格
    'space-in-parens': 'warn', // 要求在圆括号内使用一致的空格
    'space-infix-ops': 'warn', // 要求操作符周围有空格
    'space-unary-ops': 'warn', // 要求在一元操作符前后使用一致的空格
    'switch-colon-spacing': 'warn', // 要求在switch的冒号左右有空格
    'arrow-spacing': 'warn', // 要求箭头函数的箭头前后使用一致的空格
    'array-bracket-spacing': 'warn', // 要求数组方括号中使用一致的空格
    'brace-style': 'warn', // 要求在代码块中使用一致的大括号风格
    camelcase: 0, // 要求使用骆驼拼写法命名约定
    indent: ['off', 2], // 要求使用JS一致缩进2个空格
    'max-depth': ['warn', 4], // 要求可嵌套的块的最大深度4
    'max-statements': ['warn', 100], // 要求函数块最多允许的的语句数量20
    'max-nested-callbacks': ['warn', 3], // 要求回调函数最大嵌套深度3
    'max-statements-per-line': ['warn', { max: 1 }], // 要求每一行中所允许的最大语句数量
    quotes: ['off', 'single', 'avoid-escape'], // 要求统一使用单引号符号
    'vue/require-default-prop': 0, // 关闭属性参数必须默认值
    'vue/singleline-html-element-content-newline': 0, // 关闭单行元素必须换行符
    'vue/multiline-html-element-content-newline': 0, // 关闭多行元素必须换行符
    // 要求每一行标签的最大属性不超五个
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 8,
        multiline: 8,
      },
    ],
    // 要求html标签的缩进为需要2个空格
    'vue/html-indent': [
      'off',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        ignores: [],
      },
    ],
    // 取消关闭标签不能自闭合的限制设置
    'vue/html-self-closing': [
      'off',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/multi-word-component-names': [
      'off',
      {
        ignores: ['index', 'Breadcrumb', 'Language', 'Logo', 'Modal', 'Pagination'],
      },
    ],
    'vue/no-dupe-keys': ['off'],
  },
  globals: {
    require: true,
    process: true,
    VueGridLayout: true,
    Vue: true,
    ArcoVueIcon: true,
    Sortable: true,
  },
};
