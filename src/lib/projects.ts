export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  repo: string;
  pypi?: string;
  // Visual for the project, served from /public.
  image: { src: string; width: number; height: number };
};

// Descriptions are drawn from each project's own README — nothing here is invented.
export const projects: Project[] = [
  {
    slug: "madgen",
    name: "madgen",
    tagline: "音MAD自動生成ツール",
    description:
      "target(音声・動画)と複数のsourceを渡すと、sourceの断片を自動で選んで切り貼りし、targetを再現する。方式はUnit Selection TTSと同じ(候補の絞り込み → Viterbi DP)。MIDIの音高に合わせるメロディモードと、UST/USTXの音素一致を優先する歌詞モードがあり、1回のレンダリングで併用できる。",
    tags: ["Python", "PyTorch", "Unit Selection", "CLI"],
    repo: "0266st/madgen",
    pypi: "https://pypi.org/project/madgen/",
    image: { src: "/projects/madgen-collage.png", width: 1000, height: 566 },
  },
  {
    slug: "voicevox-tts-engine-for-android",
    name: "VOICEVOX TTS Engine for Android",
    tagline: "AndroidのTTSをVOICEVOXに置き換える",
    description:
      "Androidの読み上げエンジンをVOICEVOXに置き換えるソフトウェア。VOICEVOX CORE のAndroid用AARファイルを使用し、既定の話者は冥鳴ひまり。OpenJTalkとONNX Runtimeを内部で利用し、MITライセンスで配布。",
    tags: ["Kotlin", "Android", "VOICEVOX CORE", "ONNX Runtime"],
    repo: "0266st/VOICEVOX_TTS_Engine_For_Android",
    image: { src: "/projects/voicevox-tts-engine-for-android.png", width: 1197, height: 630 },
  },
];
