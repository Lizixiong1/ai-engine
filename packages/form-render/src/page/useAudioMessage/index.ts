import { useEffect, useRef } from "react";
export interface MessageRecord {
  categoryCode: string; // 1:事件处理 2:交通管制 3:车队保障 4:免费车 5:投诉工单
  createTime: string;
  id: number;
  businessId: string;
  messageContent: string;
  readStatus: number;
  readTime: string;
  receiveUserId: number;
  voiceUrl: string;
  businessType: string;
}

export interface EventRecord {
  type: "beforeunload";
  sessionId: string;
  payload: Record<string, any>;
}
interface ListItem {
  id: string;
  data?: any;
  datetime: number;
}
const ACTIVE_AUDIO_KEY = `_$audio_message_active_key`;
const AUDIO_LIST_KEY = `_$audio_list_key`;
const intervalTimer = 2000; // 循环定时器时间2秒
export const eventActions = ["click", "keydown", "mousedown"];

const getAudioList = (): ListItem[] => {
  const list = localStorage.getItem(AUDIO_LIST_KEY);
  return list ? JSON.parse(list) : [];
};

const addAudioList = (list: ListItem) => {
  const preList = getAudioList();
  const newList = [...preList, list];
  localStorage.setItem(AUDIO_LIST_KEY, JSON.stringify(newList));
};

const removeAudioListById = (id: string) => {
  const preList = getAudioList();
  const activeId = getActive();
  if (activeId === id) {
    removeActive();
  }
  if (!preList.length) return;
  const newList = preList.filter((item) => item.id !== id);
  localStorage.setItem(AUDIO_LIST_KEY, JSON.stringify(newList));
};

export const getActive = () => localStorage.getItem(ACTIVE_AUDIO_KEY);

export const setActive = (key: string) =>
  localStorage.setItem(ACTIVE_AUDIO_KEY, key);

export const removeActive = () => localStorage.removeItem(ACTIVE_AUDIO_KEY);

export function isUserGestureError(err: any) {
  return (
    err?.name === "NotAllowedError" ||
    /user.*interact|gesture/i.test(err?.message)
  );
}
class AudioMessageManager {
  static getRandomID() {
    return Math.random().toString(36).substring(2, 9) + "——" + Date.now();
  }
  // 获取消息url
  static getMessageUrl(msg?: MessageRecord) {
    if (!msg || !msg?.voiceUrl) return;
    if (msg.voiceUrl.startsWith("http")) {
      return msg.voiceUrl;
    }
    if (msg.voiceUrl.startsWith("iep/static/voice")) {
      return "/" + msg.voiceUrl;
    }
    return "/server/" + msg.voiceUrl;
  }

  audioEl: HTMLAudioElement;
  enableAudioPlay = false;
  removeEvents!: () => void;
  sessionId!: string;
  messageList: MessageRecord[] = [];
  playConfig: Record<string, any>;
  currentPlayId: number | undefined;
  // 播放等待定时器
  playWaitTimeout: number | null = null;
  // 循环定时器
  intervalTimer: number | null = null;

  constructor(playConfig: Record<string, any>) {
    this.playConfig = playConfig;
    this.audioEl = new Audio();
    this.sessionId = AudioMessageManager.getRandomID();
    this.init();
  }

  init() {
    this.removeEvents = this.initEvent();
    this.initAudioConfig();
    addAudioList({
      datetime: Date.now(),
      id: this.sessionId,
    });
    const activeId = getActive();
    if (!activeId) {
      this.enableAudioPlay = true;
      setActive(this.sessionId);
    }
    this.intervalTimer = window.setInterval(() => {
      const list = getAudioList();
      if (list.length) {
        const record = list.reduce((earliest, current) => {
          return current.datetime < earliest.datetime ? current : earliest;
        });
        if (record && record.id) {
          const activeId = getActive();
          const preEnableAudioPlay = this.enableAudioPlay;
          if (!activeId) {
            setActive(record.id);
          }
          if (!activeId || activeId === this.sessionId) {
            if (!preEnableAudioPlay) {
              console.log("设置当前页变为能播放并播放");
              this.enableAudioPlay = true;
              this.playCurrent();
            } else {
              console.log("该页面正在播放");
            }
          } else {
            if (preEnableAudioPlay) {
              this.enableAudioPlay = false;
              console.log("设置当前页变为不能播放并停止播放");
              this.resetAudioPlay();
            }
          }
        }
      }
    }, intervalTimer);
  }

  initAudioConfig() {
    this.audioEl.playbackRate = 1.0;
  }

  initEvent() {
    const Ended = this.handleAudioEnded.bind(this);
    const Errored = this.handleAudioErrored.bind(this);
    const beforeunload = this.handleBeforeunload.bind(this);
    this.audioEl.addEventListener("ended", Ended);
    this.audioEl.addEventListener("error", Errored);
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      this.audioEl.removeEventListener("ended", Ended);
      this.audioEl.removeEventListener("error", Errored);
      window.removeEventListener("beforeunload", beforeunload);
    };
  }

  handleBroadcastMessage(event: MessageEvent<EventRecord>) {
    const data = event.data;
    switch (data.type) {
      case "beforeunload":
        this.handleMasterClaim(data);
        break;
    }
  }
  handleMasterClaim(data: EventRecord) {
    const { sessionId, payload } = data;
    console.log(sessionId, payload);
  }

  handleAudioEnded() {
    console.warn("播放完成");
    this.playNext();
  }

  handleAudioErrored() {
    const currentId = this.currentPlayId;
    this.resetAudioPlay();
    this.currentPlayId = this.getNextPlayId(currentId);
    this.playCurrent();
  }

  handleBeforeunload() {
    removeAudioListById(this.sessionId);
  }

  initMessage(messageList: MessageRecord[]) {
    this.messageList = messageList;
    this.resetAudioPlay();
    this.currentPlayId = messageList[0]?.id;
    if (this.enableAudioPlay) {
      this.playCurrent();
    }
  }

  // 播放当前消息
  playCurrent() {
    const audio = this.audioEl;
    const { messageList, currentPlayId } = this;
    if (!messageList.length) return;
    const msg = messageList.find((m) => m.id === currentPlayId);
    const src = AudioMessageManager.getMessageUrl(msg);
    if (!src) {
      return;
    }
    audio.src = src;
    audio.play().catch((error) => {
      if (isUserGestureError(error) && this.enableAudioPlay) {
        // 缺少用户手势
        const autoAudio = () => {
          eventActions.forEach((event) => {
            document.removeEventListener(event, autoAudio);
          });
          this.playCurrent();
        };
        eventActions.forEach((event) => {
          document.addEventListener(event, autoAudio);
        });
      }
    });
  }

  // 播放下一条
  playNext() {
    const intervalSecond = this.playConfig?.voiceBroadcast?.intervalSecond;
    if (intervalSecond === undefined) return;
    this.playWaitTimeout = window.setTimeout(() => {
      this.currentPlayId = this.getNextPlayId();
      this.playCurrent();
    }, intervalSecond * 1000);
  }

  // 重置播放器
  resetAudioPlay() {
    if (this.playWaitTimeout) {
      window.clearTimeout(this.playWaitTimeout);
    }
    this.currentPlayId = undefined;
    this.audioEl.pause();
    this.audioEl.currentTime = 0;
  }

  getNextPlayId(id?: number) {
    id = id || this.currentPlayId;
    const { messageList } = this;
    const currentIndex = messageList.findIndex((m) => m.id === id);
    if (currentIndex === 0 && messageList.length === 1) {
      return messageList[0].id;
    }
    const nextId =
      currentIndex + 1 === messageList.length
        ? messageList[0]?.id
        : messageList[currentIndex + 1]?.id;
    return nextId;
  }

  setMuted(muted: boolean) {
    this.audioEl.muted = muted;
  }

  destroy() {
    this.removeEvents();
    if (this.playWaitTimeout) {
      window.clearTimeout(this.playWaitTimeout);
    }
    if (this.intervalTimer) {
      window.clearInterval(this.intervalTimer);
    }
    removeAudioListById(this.sessionId);
  }
}

export interface AudioMessageOptions {
  messageList: any[];
  audioConfig: any;
  playConfig: Record<string, any>;
}
export const useAudioMessage = (options: AudioMessageOptions) => {
  const { messageList, audioConfig, playConfig = {} } = options;
  const manager = useRef(new AudioMessageManager(playConfig));

  useEffect(() => {
    manager.current.initMessage(messageList);
    return () => {
      manager.current.destroy();
    };
  }, [messageList]);

  useEffect(() => {
    const _muted =
      typeof audioConfig?.muted === "undefined" ? false : audioConfig?.muted;
    if (manager.current.audioEl.muted !== _muted) {
      manager.current.setMuted(_muted);
    }
  }, [audioConfig]);
};
