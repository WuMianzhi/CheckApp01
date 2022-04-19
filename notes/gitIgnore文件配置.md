# gitignore 文件配置
参考官方文档 [gitignore](https://github.com/github/gitignore)

在根目录新建 `.gitignore` 文件
1. 添加要忽略的文件
   ```
    dist/favico.svg
   ```
2. 添加要忽略的文件夹
   ```
    dist/*
   ```
3. 强制添加要忽略文件夹内的文件
   ```
   !dist/something.js
   ```

