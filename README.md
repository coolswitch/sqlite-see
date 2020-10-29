# sqlite-see

## Project setup
```
npm install
npm rebuild
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


+ 没有默认sql tag
+ 数据库名加路径
+ sqltag自动聚焦
+ 主进程崩溃处理
  错误日志
- 加拖拽打开、右键打开
- 增删查改变为右键


/** 颜色 #xxx 2 rgb(x,x,x) */
export function colorHTX2RGB(hexStr: string): Array<number> {
  return hexStr.length === 4
    ? hexStr
        .substr(1)
        .split('')
        .map((s) => 0x11 * parseInt(s, 16))
    : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map((s) => parseInt(s, 16));
}

/** 两个颜色的差值 */
export function colorDistance(rgb1: number[], rgb2: number[]): number {
  let d = 0;
  for (let i = 0; i < rgb1.length; i += 1) {
    d += (rgb1[i] - rgb2[i]) * (rgb1[i] - rgb2[i]);
  }
  return Math.sqrt(d);
}

/** 根据原颜色 计算随机颜色（过滤复制的样式） */
const RandomColor = (color: string) => {
  color = color === 'pink' ? 'red' : color.toLocaleLowerCase();
  color = color === 'purple' ? 'violet' : color.toLocaleLowerCase();
  const named = ['gray', 'blue', 'black', 'red', 'violet'];
  let index = named.findIndex((item) => color.includes(item));
  if (index > -1) return allowColors[index];
  if (!color.match(/\d/)) return allowColors[2];

  const rgbs = allowColors.map((item) => colorHTX2RGB(item));
  const colornum = colorHTX2RGB(color);
  let minimum = 100;
  rgbs.forEach((item, i) => {
    const offset = colorDistance(item, colornum);
    if (minimum > offset) {
      minimum = offset;
      index = i;
    }
  });
  return allowColors[index];
};


--

/** 根据原颜色 计算随机颜色（过滤复制的样式） */
const RandomColor = (color: string) => {
  color = color === 'pink' ? 'red' : color.toLocaleLowerCase();
  color = color === 'purple' ? 'violet' : color.toLocaleLowerCase();
  const named = ['gray', 'blue', 'black', 'red', 'violet'];
  let index = named.findIndex((item) => color.includes(item));
  if (index > -1) return allowColors[index];
  if (!color.match(/\d/)) return allowColors[2];

  const numbers = allowColors.map((item) => parseInt(item.substr(1), 16));
  const colornum = parseInt(color.substr(1), 16);
  let minimum = 16777215;
  numbers.forEach((n, i) => {
    const offset = Math.abs(n - colornum);
    if (minimum > offset) {
      minimum = offset;
      index = i;
    }
  });
  return allowColors[index];
};