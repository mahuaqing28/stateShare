const statusLabels = {
  done: "已完成",
  doing: "进行中",
  todo: "待开始",
};

const fallbackData = {
  owner: "我",
  tagline: "今天也在把混乱整理成可以交付的小块。",
  updatedAt: "手动更新",
  energy: 72,
  focus: 80,
  progress: 46,
  funnyStatus: "大脑正在加载，咖啡驱动器运行正常。",
  progressNote: "先推进最重要的一件事，剩下的排队进站。",
  schedule: [
    {
      time: "09:30",
      title: "整理今日目标",
      note: "把任务拆成能下手的三块",
      status: "done",
    },
    {
      time: "14:00",
      title: "深度工作",
      note: "关掉干扰，专注推进主线",
      status: "doing",
    },
    {
      time: "20:30",
      title: "复盘和同步",
      note: "记录进度，更新明天入口",
      status: "todo",
    },
  ],
};

const $ = (selector) => document.querySelector(selector);

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
};

const formatToday = () =>
  new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());

const renderSchedule = (items) => {
  const list = $("#schedule-list");
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "schedule-item";

    const pillClass = item.status === "doing" ? "doing" : item.status === "todo" ? "todo" : "";
    const time = document.createElement("time");
    const main = document.createElement("div");
    const title = document.createElement("strong");
    const note = document.createElement("span");
    const status = document.createElement("span");

    time.className = "time-block";
    time.textContent = item.time || "--:--";
    main.className = "schedule-main";
    title.textContent = item.title || "未命名日程";
    note.textContent = item.note || "";
    status.className = `status-pill ${pillClass}`.trim();
    status.textContent = statusLabels[item.status] || item.status || "待更新";

    main.append(title, note);
    li.append(time, main, status);
    list.appendChild(li);
  });
};

const render = (data) => {
  const progress = clamp(data.progress);
  const energy = clamp(data.energy);
  const focus = clamp(data.focus);
  const schedule = Array.isArray(data.schedule) ? data.schedule : [];
  const doneCount = schedule.filter((item) => item.status === "done").length;

  $("#today-label").textContent = formatToday();
  $("#page-title").textContent = `${data.owner || "我"}的今日状态`;
  $("#tagline").textContent = data.tagline || fallbackData.tagline;
  $("#last-updated").textContent = data.updatedAt ? `更新：${data.updatedAt}` : "更新：刚刚";
  $("#energy-value").textContent = `${energy}%`;
  $("#focus-value").textContent = `${focus}%`;
  $("#progress-value").textContent = `${progress}%`;
  $("#funny-status").textContent = data.funnyStatus || fallbackData.funnyStatus;
  $("#progress-chip").textContent = `${progress}%`;
  $("#progress-bar").style.width = `${progress}%`;
  $("#progress-note").textContent = data.progressNote || fallbackData.progressNote;
  $("#schedule-count").textContent = `${schedule.length} 项`;

  renderSchedule(schedule);

  const shareText = `${formatToday()}｜${data.owner || "我"}：${data.funnyStatus || fallbackData.funnyStatus} 今日进度 ${progress}%，日程 ${doneCount}/${schedule.length} 完成。`;
  $("#share-text").textContent = shareText;
  $("#copy-button").onclick = async () => {
    await navigator.clipboard.writeText(shareText);
    $("#copy-button").textContent = "已复制";
    window.setTimeout(() => {
      $("#copy-button").textContent = "复制状态";
    }, 1400);
  };
};

fetch("data/status.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Status data not found");
    return response.json();
  })
  .then(render)
  .catch(() => render(fallbackData));
