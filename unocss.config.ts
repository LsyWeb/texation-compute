// uno.config.ts
import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [
    presetUno(), // 基础原子类预设
    presetAttributify(), // 支持属性模式（如 <div flex justify-center>）
  ],
  shortcuts: {
    "flex-center": "flex justify-center items-center",
  },
  rules: [
    // 自定义规则
    [/^text-(\d+)$/, ([, d]) => ({ "font-size": `${d}px` })],
  ],
});