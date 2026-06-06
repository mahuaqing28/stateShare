# 今日状态共享页

一个可以部署到 GitHub Pages 的纯静态状态页，用来分享今日安排和一点当前状态。

## 怎么更新状态

编辑 `data/status.json`：

- `owner`：页面标题里的名字
- `today`：状态对应的日期，格式如 `2026-06-06`
- `tagline`：今日一句话说明
- `updatedAt`：你手动写的更新时间
- `today_bgm`：今日背景音乐
- `funnyStatus`：用轻松的方式描述当前状态
- `schedule`：今日日程列表，`type` 可用 `TIME_BLOCK`、`FLOATING`
- `schedule[].start_time` / `schedule[].end_time`：时间块的可选起止时间，格式如 `09:30`

`FLOATING` 日程会显示在浮动安排里，不会进入时间轴。

提交并推送后，GitHub Action 会把页面发布到 GitHub Pages。

## 启用 GitHub Pages

1. 打开仓库的 `Settings`。
2. 进入 `Pages`。
3. 在 `Build and deployment` 里选择 `GitHub Actions`。
4. 推送到 `main` 分支后等待工作流完成。

## 本地预览

```powershell
python -m http.server 8080
```

然后打开 `http://localhost:8080`。
