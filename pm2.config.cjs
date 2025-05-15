// ecosystem.config.js


// pm2 start npm --name dvue -- run serve
module.exports = {
    apps: [
      {
        // 必填项：应用名称
        name: 'dvue', // 你可以改成你Vue项目的名称，例如 'ds-vue'
  
        // 必填项：要执行的脚本
        // 如果使用 `serve` 包来托管静态文件 (推荐用于纯前端Vue项目)
        script: 'startscript.js',
  
        // 传递给 script 的参数
        // 'spa' 模式确保单页应用路由正常工作
        // 'dist' 是Vue build后的静态文件目录
        // '3000' 是服务端口号，你可以按需修改
        args: '',
  
        // 如果你的 `serve` 不是全局安装，或者你想指定node解释器路径，可以取消注释并修改：
        // interpreter: 'node', // 或者 /path/to/your/node
        // exec_mode: 'fork', // serve 通常作为独立命令运行，fork模式即可
        exec_mode: 'cluster',

        // 可选项：是否监听文件变化并自动重启 (生产环境通常设为 false，因为 dist 目录不应频繁变动)
        watch: false,
  
        // 可选项：应用崩溃时是否自动重启
        autorestart: true,
  
        // 可选项：最大连续不稳定重启次数（例如，1秒内启动失败超过10次则停止）
        // 你原来的 max_restarts: 100000 意味着几乎无限次重启，根据需要调整
        max_restarts: 100000, // 示例值，可以根据你的需求调整
  
        // 可选项：应用至少稳定运行多少毫秒后才算启动成功 (低于此值算作启动失败)
        min_uptime: 5000, // 5秒
  
        // 可选项：重启之间的延迟时间（毫秒）
        restart_delay: 3000, // 3秒
  
        // 可选项：环境变量
        env: {
          NODE_ENV: 'production', // 确保应用以生产模式运行（如果serve或你的脚本会读取它）
          // PORT: 3000, // 也可以在这里定义端口，然后在args或脚本中引用 process.env.PORT
        },
  
        // 可选项：标准输出日志文件路径
        // '/dev/null' (Linux/macOS) 或 'NUL' (Windows) 用于丢弃标准输出日志
        // 如果你想保存标准输出日志，可以指定一个文件路径，例如 './logs/app-out.log'
        out_file: process.platform === 'win32' ? 'NUL' : '/dev/null', // 根据操作系统选择
        // out_file: './logs/my-vue-app-out.log', // 如果需要输出日志
  
        // 可选项：错误输出日志文件路径
        error_file: './logs/my-vue-app-error.log', // 推荐保留错误日志
  
        // 可选项：日志日期格式
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Z 表示时区
  
        // 可选项：合并工作进程的日志文件。默认为 false。
        // merge_logs: true,
  
        // 可选项：PM2 将在哪个目录下执行你的脚本。默认为 ecosystem 文件所在的目录。
        // cwd: '/path/to/your/project/root', // 如果ecosystem文件不在项目根目录
  
        // 可选项：忽略监听的目录/文件，如果 watch 为 true 时生效
        // ignore_watch : ["node_modules", "logs"],
      }
    ]
  };